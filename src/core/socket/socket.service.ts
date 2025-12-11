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
    const readFlag = await this.sessionService.readMessage(uid, message);
    if (readFlag) {
      return Response.ok(this.i18n.t('message.READ_SUCCESS'), readFlag);
    }
    return Response.fail(this.i18n.t('message.READ_FAILED'));
  }

  // 发送消息
  async sendMessage(uid: number, message: SendMessageDto) {
    const data = await this.sessionService.createAndSendMessage(uid, message);
    if (data) {
      const { message, senderInfo, session, sessionExtra, memberIds } = data;
      this.sseService.sendToUsers(memberIds, [
        { session, sessionExtra, isLatest: true },
      ]);
      return Response.ok(this.i18n.t('message.SEND_SUCCESS'), {
        message,
        senderInfo,
      });
    }
    return Response.fail(this.i18n.t('message.SEND_FAILED'));
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

      if (unreadMessages.list?.length > 0) {
        this.server.to(session_id).emit('message', unreadMessages.list);
        const hasMoreData = currentPage * pageSize < unreadMessages.total;
        if (hasMoreData) {
          await pushUnreadMessages(currentPage + 1);
        }
      }
    };

    await pushUnreadMessages();
  }
}
