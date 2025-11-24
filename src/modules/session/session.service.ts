import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatTypeEnum, SessionEntity } from './entity/session.entity';
import { AddSessionDto } from './dto/add-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FindAllSessionDto } from './dto/find-all-session.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { FindAllDto } from 'src/common/dto/common.dto';
import { MessageService } from '../message/message.service';
import { MessageReadRecordsService } from '../message-read-records/message-read-records.service';
import { GroupService } from '../group/group.service';
import { MateService } from '../mate/mate.service';
import { ReadMessageDto, SendMessageDto } from './dto/operate-message.dto';
import { MessageEntity } from '../message/entity/message.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly i18n: I18nService,
    private readonly messageService: MessageService,
    private readonly messageReadRecordsService: MessageReadRecordsService,
    private readonly mateService: MateService,
    private readonly groupService: GroupService,
  ) {}

  /* 添加一个会话 */
  async addSession(data: AddSessionDto) {
    const entityData = this.sessionRepository.create(data);
    const insertRes = await this.sessionRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有会话 */
  async findAllSession(query: FindAllSessionDto) {
    const { current = 1, pageSize = 10, session_id, chat_type } = query || {};
    const qb = this.sessionRepository.createQueryBuilder('session');
    if (session_id) {
      qb.andWhere('session_id LIKE :session_id', {
        session_id: '%' + session_id + '%',
      });
    }
    if (chat_type) {
      qb.andWhere('chat_type = :chat_type', {
        chat_type: chat_type,
      });
    }

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 查询指定会话 */
  async findOneSession(id: number) {
    const result = await this.sessionRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
  }

  /* 修改会话信息 */
  async updateSession(id: number, data: UpdateSessionDto) {
    const result = await this.sessionRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除会话 */
  async softDeleteSession(id: number) {
    const result = await this.sessionRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复会话 */
  async restoreSession(id: number) {
    const result = await this.sessionRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除会话 */
  async deleteSession(id: number) {
    const result = await this.sessionRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 查询指定会话 通过会话id和用户id */
  async findOneSessionByDoubleId(id: number, session_id: string) {
    const result = await this.sessionRepository.findOne({
      where: { id, session_id },
    });
    return result;
  }

  /* 查询指定会话 通过会话id */
  async findOneSessionBySessionId(session_id: string) {
    const result = await this.sessionRepository.findOne({
      where: { session_id },
    });
    return result;
  }

  /* 查询指定会话 通过会话id */
  async findOneSessionById(id: number) {
    const result = await this.sessionRepository.findOne({
      where: { id },
    });
    return result;
  }

  /* 保存会话 */
  async saveSession(session: SessionEntity) {
    return await this.sessionRepository.save(session);
  }

  /* 查询指定用户的所有会话 */
  async findAllUserSession(uid: number, query: FindAllDto) {
    const { current = 1, pageSize = 10 } = query || {};
    const qb = this.sessionRepository.createQueryBuilder('session');
    qb.where('session.user_id = :uid', { uid });

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 双重id验证会话的合法性 */
  async verifySessionByDoubleId(uid: number, id: number, session_id: string) {
    const session = await this.findOneSessionByDoubleId(id, session_id);
    if (!session) {
      return false;
    }
    if (session.chat_type == ChatTypeEnum.group) {
      const group = await this.groupService.verifyUserIsMember(uid, session_id);
      if (!group) {
        return false;
      }
      return session;
    }
    if (session.chat_type == ChatTypeEnum.private) {
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
      this.findOneSessionBySessionId(session_id),
    ]);

    // 如果会话已存在且验证通过
    if (session) {
      if (session.chat_type == ChatTypeEnum.group && group) {
        return session;
      }
      if (session.chat_type == ChatTypeEnum.private && mate) {
        return session;
      }
      return false;
    }

    // 会话不存在，创建新会话
    if (group) {
      const result = await this.addSession({
        session_id,
        chat_type: ChatTypeEnum.group,
      });
      if (result.code == 0) return result.data as SessionEntity;
    }

    if (mate) {
      const result = await this.addSession({
        session_id,
        chat_type: ChatTypeEnum.private,
      });
      if (result.code == 0) return result.data as SessionEntity;
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
    if (result.code == 0) {
      const message = result.data as MessageEntity;
      session.lastMsg = message;
      await this.saveSession(session);
      return message;
    }
    return false;
  }

  /* 读取消息 */
  async readMessage(uid: number, data: ReadMessageDto) {
    const { messageId, session_id, session_primary_id } = data;
    const session = await this.verifySessionByDoubleId(
      uid,
      session_primary_id,
      session_id,
    );
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
    if (recordRes.code == 0) {
      return true;
    }
    return false;
  }
}
