import { JwtAuthGuard } from 'src/core/auth/jwt.auth.guard';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { ChatService } from '../chat/chat.service';
import { sessionEntity } from 'src/entities/session.entity';
import { RedisService } from 'src/core/Redis/redis.service';
import { ResultMsg } from 'src/commom/utils/result';
import { BaseConst } from 'src/commom/constants/base.const';
import { CreateChatDto } from '../chat/dto/create-chat.dto';

interface IClientMsg {
  type: string;
  data: any;
}

// 客户端确认消息已读类型
interface IReadMsg {
  uid: number;
  msgId: number;
  sId: number;
}

interface IInitMsg {
  uid: number;
  clientId: string;
}

interface IChatsMsg extends CreateChatDto {
  isReSend: boolean;
}

@WebSocketGateway(3001, { namespace: 'socket' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly sessionService: SessionService,
    private readonly chatService: ChatService,
    private readonly redisService: RedisService,
  ) {}
  // 使用WebSocketServer装饰器获取Socket.IO服务器实例
  @WebSocketServer()
  server: Server;

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: IClientMsg) {
    // console.log('接收消息：', payload);
    const { type, data } = payload || {};
    // 客户端接受消息后，向服务端确认消息已收到
    if (type === 'readMsg') {
      data as IReadMsg;
      const msgRes = await this.chatService.findOneChatmsgbyId(data.msgId);
      if (msgRes) {
        if (msgRes.send_uid === data.uid) {
          return ResultMsg.socket('自己发送的消息', msgRes, true);
        }
        const readRes = await this.chatService.updateChatmsg({
          id: data.msgId,
          msg_status: 'read',
        });
        const unreadCountRes =
          await this.sessionService.updateSessionUnreadCount(data.sId);
        if (readRes.success && unreadCountRes.success) {
          // console.log('已读消息：', data);
          return ResultMsg.socket('已读消息', unreadCountRes.data, true);
        } else {
          return ResultMsg.socket('更新消息状态失败', null, false);
        }
      } else {
        return ResultMsg.socket('未找到消息', null, false);
      }
    }

    if (type === 'init') {
      data as IInitMsg;
      const { uid, clientId } = data || {};
      if (clientId !== client.id) {
        return;
      }
      this.redisService.setValue(clientId, uid);
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('chat')
  async handleChat(client: Socket, payload: IChatsMsg): Promise<ResultMsg> {
    console.log('[chat]接收消息：', payload);
    const { send_uid, session_id, isReSend } = payload || {};
    const send_ip = client.handshake.address;
    // console.log('远端地址', send_ip);

    /* 添加新消息/发送/更新会话 */
    const addNewMsg = async (
      sessionData: sessionEntity,
      payload: CreateChatDto,
    ) => {
      // 添加消息
      const chatMsgRes = await this.chatService.createChatmsg({
        send_ip,
        ...payload,
      });
      if (chatMsgRes.success) {
        const chatMsgData = chatMsgRes.data;
        const msgId = chatMsgData.id;
        delete chatMsgData.id; // 删除消息id，避免混淆会话id
        const updateRes = await this.sessionService.updateSession({
          msgId,
          id: sessionData.id,
          ...chatMsgData,
        });
        if (updateRes.success) {
          chatMsgData.id = msgId; // 还原消息id
          // 向指定会话房间广播消息
          this.server.emit(BaseConst.RoomName + session_id, {
            ...chatMsgData,
            isReSend,
          });
          return ResultMsg.socket(
            '会话更新成功',
            { ...chatMsgData, isReSend },
            true,
          );
        } else {
          return ResultMsg.socket(updateRes.message, payload, false);
        }
      } else {
        return ResultMsg.socket('新增消息失败', payload, false);
      }
    };

    /* 查询会话是否存在 */
    const sessionData = await this.sessionService.findOneSession({
      session_id,
    });
    if (sessionData) {
      return addNewMsg(sessionData, payload);
    } else {
      const addSessionRes = await this.sessionService.createChatSession({
        creator_uid: send_uid,
        ...payload,
      });
      if (addSessionRes.success) {
        return addNewMsg(addSessionRes.data, payload);
      } else {
        return ResultMsg.socket(addSessionRes.message, payload, false);
      }
    }
  }

  handleConnection(client: Socket) {
    // 监听连接开启事件
    console.log(`客户端已连接：${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    // 监听连接关闭事件
    console.log(`客户端已断开连接：${client.id}`);

    const uid = await this.redisService.getValue(client.id);
    if (uid) {
    }
    this.redisService.delValue(client.id);
  }
}
