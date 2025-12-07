import { WsJwtAuthGuard } from 'src/core/auth/guards/ws-jwt.auth.guard';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { Response } from 'src/common/response/api-response';
import { MessageEntity } from '../message/entity/message.entity';
import { WsUserId } from 'src/core/auth/decorators/ws-user.decorator';
import { SocketService } from './socket.service';
import { I18nService } from 'nestjs-i18n';
import {
  ReadMessageDto,
  SendMessageDto,
} from '../session/dto/operate-message.dto';
import { SenderInfoDto } from 'src/common/dto/common.dto';

interface MessageWithSenderInfo {
  message: MessageEntity;
  senderInfo: SenderInfoDto;
}

@WebSocketGateway(3001, { namespace: 'socket' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly sessionService: SessionService,
    private readonly socketService: SocketService,
    private readonly i18n: I18nService,
  ) {}
  @WebSocketServer()
  server: Server;

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('read-message')
  async handleMessage(
    @WsUserId() uid: number,
    @MessageBody() message: ReadMessageDto,
  ): Promise<Response<boolean>> {
    const readFlag = await this.sessionService.readMessage(uid, message);
    if (readFlag) {
      return Response.ok(this.i18n.t('message.READ_SUCCESS'), readFlag);
    }
    return Response.fail(this.i18n.t('message.READ_FAILED'));
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('send-message')
  async sendMessage(
    @WsUserId() uid: number,
    @ConnectedSocket() client: Socket,
    @MessageBody() message: SendMessageDto,
  ): Promise<Response<MessageWithSenderInfo>> {
    Logger.log('[send-message]接收消息：', message);
    message.sender_ip = client.handshake.address;
    const toBeSentMessage = await this.sessionService.createAndSendMessage(
      uid,
      message,
    );
    if (toBeSentMessage) {
      client.to(message.session_id).emit('message', toBeSentMessage);
      return Response.ok(this.i18n.t('message.SEND_SUCCESS'), toBeSentMessage);
    }
    return Response.fail(this.i18n.t('message.SEND_FAILED'));
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('join-room')
  async joinRoom(client: Socket, session_id: string) {
    Logger.log(`客户端 ${client.id}, 加入房间 ${session_id}`);
    await client.join(session_id);
    return Response.ok(this.i18n.t('message.JOIN_SUCCESS'), session_id);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('leave-room')
  async leaveRoom(client: Socket, session_id: string) {
    Logger.log(`客户端 ${client.id}, 退出房间 ${session_id}`);
    await client.leave(session_id);
    return Response.ok(this.i18n.t('message.LEAVE_SUCCESS'), session_id);
  }

  handleConnection(client: Socket) {
    // 监听连接开启事件
    Logger.log(`客户端已连接：${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // 监听连接关闭事件
    Logger.log(`客户端已断开连接：${client.id}`);
  }
}
