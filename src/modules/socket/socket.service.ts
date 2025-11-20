import { Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { MessageReadRecordsService } from '../message-read-records/message-read-records.service';
import { GroupService } from '../group/group.service';
import { SessionService } from '../session/session.service';
import { MateService } from '../mate/mate.service';
import { ChatTypeEnum, SessionEntity } from '../session/entity/session.entity';
import { ReadMessageDto, SendMessageDto } from './dto/operate-message.dto';
import { I18nService } from 'nestjs-i18n';
import { MessageEntity } from '../message/entity/message.entity';

@Injectable()
export class SocketService {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageReadRecordsService: MessageReadRecordsService,
    private readonly sessionService: SessionService,
    private readonly mateService: MateService,
    private readonly groupService: GroupService,
    private readonly i18n: I18nService,
  ) {}

  /* 双重id验证会话的合法性 */
  async verifySessionByDoubleId(uid: number, id: number, session_id: string) {
    const session = await this.sessionService.findOneSessionByDoubleId(
      id,
      session_id,
    );
    if (!session) {
      return false;
    }
    if (session.chat_type === ChatTypeEnum.group) {
      const group = await this.groupService.verifyUserIsMember(uid, session_id);
      if (!group) {
        return false;
      }
      return session;
    }
    if (session.chat_type === ChatTypeEnum.private) {
      const mate = await this.mateService.verifyUserIsMate(uid, session_id);
      if (!mate) {
        return false;
      }
      return session;
    }
    return false;
  }

  /* 会话session_id验证会话的合法性, 并返回会话实体 */
  async verifySessionBySessionId(uid: number, session_id: string) {
    const [group, mate, session] = await Promise.all([
      this.groupService.verifyUserIsMember(uid, session_id),
      this.mateService.verifyUserIsMate(uid, session_id),
      this.sessionService.findOneSessionBySessionId(session_id),
    ]);

    // 如果会话已存在且验证通过
    if (session) {
      if (session.chat_type === ChatTypeEnum.group && group) {
        return session;
      }
      if (session.chat_type === ChatTypeEnum.private && mate) {
        return session;
      }
      return false;
    }

    // 会话不存在，创建新会话
    if (group) {
      const result = await this.sessionService.addSession({
        session_id,
        chat_type: ChatTypeEnum.group,
      });
      if (result.code === 0) return result.data as SessionEntity;
    }

    if (mate) {
      const result = await this.sessionService.addSession({
        session_id,
        chat_type: ChatTypeEnum.private,
      });
      if (result.code === 0) return result.data as SessionEntity;
    }

    return false;
  }

  /* 会话id验证会话的合法性 */
  async verifySessionBySId(uid: number, id: number) {
    const session = await this.sessionService.findOneSessionById(id);

    // 如果会话已存在且验证通过
    if (session) {
      if (session.chat_type === ChatTypeEnum.group) {
        const group = await this.groupService.verifyUserIsMember(
          uid,
          session.session_id,
        );
        if (!group) {
          return false;
        }
        return true;
      }
      if (session.chat_type === ChatTypeEnum.private) {
        const mate = await this.mateService.verifyUserIsMate(
          uid,
          session.session_id,
        );
        if (!mate) {
          return false;
        }
        return true;
      }
    }
    return false;
  }

  /* 验证会话的合法性 */
  async verifySessionLegality(uid: number, session_id: string, id?: number) {
    let session: SessionEntity | false = false;
    if (id) {
      session = await this.verifySessionByDoubleId(uid, id, session_id);
    } else {
      session = await this.verifySessionBySessionId(uid, session_id);
    }
    return session;
  }

  /* 创建并发送消息 */
  async createAndSendMessage(uid: number, data: SendMessageDto) {
    const { session_primary_id, session_id } = data;
    const session = await this.verifySessionLegality(
      uid,
      session_id,
      session_primary_id,
    );
    if (!session) {
      return false;
    }
    const result = await this.messageService.addMessage({
      ...data,
      sender_id: uid,
    });
    if (result.code === 0) {
      const message = result.data as MessageEntity;
      session.lastMsg = message;
      await this.sessionService.saveSession(session);
      return message;
    }
    return false;
  }

  /* 读取消息 */
  async readMessage(uid: number, data: ReadMessageDto) {
    const { messageId, sessionId } = data;
    const session = await this.verifySessionBySId(uid, sessionId);
    if (!session) {
      return false;
    }
    const messageRes = await this.messageService.findOneMessage(messageId);
    if (messageRes.code !== 0) {
      return false;
    }
    const recordRes =
      await this.messageReadRecordsService.addMessageReadRecords({
        message_id: messageId,
        user_id: uid,
      });
    if (recordRes.code === 0) {
      return true;
    }
    return false;
  }
}
