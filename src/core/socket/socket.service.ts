import { Injectable } from '@nestjs/common';
import { SessionService } from 'src/modules/session/session.service';
import {
  ReadMessageDto,
  SendMessageDto,
} from 'src/modules/session/dto/operate-message.dto';
import { Response } from 'src/common/response/api-response';
import { SseService } from '../sse/sse.service';
import { I18nService } from 'nestjs-i18n';
import { Server } from 'socket.io';
import { ChatTypeEnum } from 'src/modules/session/entity/session.entity';

@Injectable()
export class SocketService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sseService: SseService,
    private readonly i18n: I18nService,
  ) {}

  // 用于存储 Server 对象的引用
  private server: Server;

  // 设置 Server 对象的方法
  setServer(server: Server) {
    this.server = server;
  }

  // 读取消息
  async readMessage(uid: number, message: ReadMessageDto) {
    const flag = await this.sessionService.readMessage(uid, message);
    if (flag) {
      return Response.ok(this.i18n.t('message.READ_SUCCESS'), flag);
    }
    return Response.fail(this.i18n.t('message.READ_FAILED'));
  }

  // 发送消息
  async sendMessage(uid: number, message: SendMessageDto) {
    const data = await this.sessionService.createMessage(uid, message);
    if (data) {
      const { message, session, mate, group, memberIds } = data;

      this.sseService.sendToUsers({
        session,
        memberIds,
        mate,
        group,
        isLatest: true,
      });
      if (session.chat_type === ChatTypeEnum.group) {
        const senderInfo = this.sessionService.formatGroupSenderInfo(
          uid,
          session,
          group,
        );
        return Response.ok(this.i18n.t('message.SEND_SUCCESS'), {
          message,
          senderInfo,
        });
      }
      if (session.chat_type === ChatTypeEnum.private) {
        const senderInfo = this.sessionService.formatPrivateSenderInfo(
          uid,
          session,
          mate,
        );
        return Response.ok(this.i18n.t('message.SEND_SUCCESS'), {
          message,
          senderInfo,
        });
      }
    }
    return Response.fail(this.i18n.t('message.SEND_FAILED'));
  }

  // 创建并发送系统消息
  async sendSystemMessage(uid: number, session_id: string, message: string) {
    const systemMessage = await this.sessionService.createSystemMessage(
      uid,
      session_id,
      message,
    );
    if (systemMessage) {
      this.server.to(session_id).emit('system-message', [systemMessage]);
    }
  }

  // 处理所有会话未读消息并推送
  async processAllSessionMessagesUnread(uid: number, session_id: string) {
    const pushUnreadMessages = async (currentPage: number = 1) => {
      const pageSize = 20;
      const unreadMessages =
        await this.sessionService.findAllSessionMessagesUnread(
          uid,
          session_id,
          {
            current: currentPage,
            pageSize: pageSize,
          },
        );

      if (unreadMessages.list.length === 0) {
        return;
      }
      this.server.to(session_id).emit('unread-message', unreadMessages.list);
      const hasMoreData = currentPage * pageSize < unreadMessages.total;
      if (hasMoreData) {
        await pushUnreadMessages(currentPage + 1);
      } else {
        return;
      }
    };

    await pushUnreadMessages();
  }
}
