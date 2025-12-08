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
import { SenderInfoDto } from 'src/common/dto/common.dto';
import { GroupEntity } from '../group/entity/group.entity';
import { MateEntity } from '../mate/entity/mate.entity';

interface SessionWithSenderInfo {
  session: SessionEntity;
  senderInfo: SenderInfoDto;
}

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

  /* 查询指定会话 通过会话主id和uuid */
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

  /* 查询指定用户的所有会话 */
  async findAllUserSession(uid: number, query: FindAllDto) {
    const { current = 1, pageSize = 10 } = query || {};
    const groupIds = await this.groupService.findAllUserExistGroup(uid);
    const mateIds = await this.mateService.findAllUserExistMate(uid);
    const sessionIds = [
      ...groupIds.map((g) => g.group_id),
      ...mateIds.map((m) => m.mate_id),
    ];

    // 获取会话列表
    const qb = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoin('session.lastMsg', 'lastMsg')
      .leftJoin('session.group', 'group', 'session.chat_type = :groupType', {
        groupType: ChatTypeEnum.group,
      })
      .leftJoin(
        'group.members',
        'groupMember',
        'groupMember.user_id = lastMsg.sender_id AND groupMember.group_primary_id = group.id',
      )
      .leftJoin('session.mate', 'mate', 'session.chat_type = :privateType', {
        privateType: ChatTypeEnum.private,
      })
      .leftJoin('mate.user', 'user')
      .leftJoin('mate.friend', 'friend')
      .select([
        'session',
        'lastMsg.content',
        'lastMsg.msg_type',
        'lastMsg.msg_secret',
        'group.id',
        'group.group_name',
        'group.group_avatar',
        'groupMember.member_remarks',
        'groupMember.user_id',
        'user.id',
        'user.user_avatar',
        'friend.id',
        'friend.user_avatar',
        'mate.mate_id',
        'mate.friend_id',
        'mate.friend_remarks',
        'mate.user_id',
        'mate.user_remarks',
      ])
      .where('session.session_id IN (:...sessionIds)', { sessionIds })
      .orderBy('session.update_time', 'DESC');

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const sessions = await qb.getMany();

    console.log(sessions[0].mate);

    // 处理会话数据，添加会话名称、头像和未读消息数量
    const processedSessions = await Promise.all(
      sessions.map(async (session) => {
        const { group, mate, ...sessionData } = session;
        const sessionExtra = {
          session_name: null,
          session_avatar: null,
          unread_count: 0,
          userId: 0,
          groupId: 0,
          lastSenderRemarks: null,
        };

        if (session.chat_type === ChatTypeEnum.group && group) {
          sessionExtra.groupId = group?.id || 0;
          sessionExtra.session_name = group?.group_name || '未知群组';
          sessionExtra.session_avatar = group?.group_avatar || '';
          sessionExtra.lastSenderRemarks =
            group?.members[0]?.user_id === uid
              ? null
              : group?.members[0]?.member_remarks || '';
        }
        if (session.chat_type === ChatTypeEnum.private && mate) {
          const targetUser = mate.user_id === uid ? mate.friend : mate.user;
          const remark =
            mate.user_id === uid ? mate.friend_remarks : mate.user_remarks;
          sessionExtra.session_name = remark || '未知用户';
          sessionExtra.session_avatar = targetUser?.user_avatar || '';
          sessionExtra.userId = targetUser?.id || 0;
        }

        // 计算未读消息数量
        const messageCount = await this.messageService.findCountBySessionId(
          uid,
          session.id,
        );
        const readCount =
          await this.messageReadRecordsService.findCountBySessionId(
            uid,
            session.id,
          );
        sessionExtra.unread_count = messageCount - readCount;

        return {
          session: sessionData,
          sessionExtra: sessionExtra,
        };
      }),
    );

    return PageResponse.list(processedSessions, count);
  }

  /**
   * 格式化群组会话发送者信息
   * @param uid 用户ID
   * @param session 会话实体
   * @param group 群组实体
   * @returns 格式化后的发送者信息
   */
  formatGroupSenderInfo(
    uid: number,
    session: SessionEntity,
    group: GroupEntity,
  ) {
    return {
      chat_type: session?.chat_type,
      user_id: uid,
      remarks: group?.members[0]?.member_remarks || '',
      avatar: group?.members[0]?.user?.user_avatar || '',
    } as SenderInfoDto;
  }

  /**
   * 格式化私聊会话发送者信息
   * @param uid 用户ID
   * @param session 会话实体
   * @param mate 好友实体
   * @returns 格式化后的发送者信息
   */
  formatPrivateSenderInfo(
    uid: number,
    session: SessionEntity,
    mate: MateEntity,
  ) {
    const targetUser = mate?.user_id === uid ? mate?.user : mate?.friend;
    return {
      chat_type: session?.chat_type,
      user_id: uid,
      remarks:
        mate?.user_id === uid
          ? mate?.user_remarks || ''
          : mate?.friend_remarks || '',
      avatar: targetUser?.user_avatar || '',
    } as SenderInfoDto;
  }

  /* 双重id验证会话的合法性 */
  async verifySessionByDoubleId(uid: number, id: number, session_id: string) {
    const session = await this.findOneSessionByDoubleId(id, session_id);
    if (!session) {
      return false;
    }
    if (session.chat_type == ChatTypeEnum.group) {
      const group = await this.groupService.findOneGroupMemberBase(
        uid,
        session_id,
      );
      if (!group) {
        return false;
      }
      return {
        session,
        senderInfo: this.formatGroupSenderInfo(uid, session, group),
      };
    }
    if (session.chat_type == ChatTypeEnum.private) {
      const mate = await this.mateService.findOneMateBase(uid, session_id);
      if (!mate) {
        return false;
      }
      return {
        session,
        senderInfo: this.formatPrivateSenderInfo(uid, session, mate),
      };
    }
    return false;
  }

  /* 会话session_id验证会话的合法性 */
  async verifySessionBySessionId(uid: number, session_id: string) {
    const [group, mate, session] = await Promise.all([
      this.groupService.findOneGroupMemberBase(uid, session_id),
      this.mateService.findOneMateBase(uid, session_id),
      this.findOneSessionBySessionId(session_id),
    ]);
    if (session) {
      if (session.chat_type == ChatTypeEnum.group && group) {
        return session;
      }
      if (session.chat_type == ChatTypeEnum.private && mate) {
        return session;
      }
      return false;
    }
    return false;
  }

  /* 会话session_id验证会话的合法性, 若不存在则创建 */
  async verifySessionWithCreateBySessionId(uid: number, session_id: string) {
    const [group, mate, session] = await Promise.all([
      this.groupService.findOneGroupMemberBase(uid, session_id),
      this.mateService.findOneMateBase(uid, session_id),
      this.findOneSessionBySessionId(session_id),
    ]);

    // 如果会话已存在且验证通过
    if (session) {
      if (session.chat_type == ChatTypeEnum.group && group) {
        return {
          session,
          senderInfo: this.formatGroupSenderInfo(uid, session, group),
        };
      }
      if (session.chat_type == ChatTypeEnum.private && mate) {
        return {
          session,
          senderInfo: this.formatPrivateSenderInfo(uid, session, mate),
        };
      }
      return false;
    }

    // 会话不存在，创建新会话
    if (group) {
      const session = this.sessionRepository.create({
        session_id,
        create_by: uid,
        chat_type: ChatTypeEnum.group,
      });
      session.group = group;
      const savedSession = await this.sessionRepository.save(session);
      return {
        session: savedSession,
        senderInfo: this.formatGroupSenderInfo(uid, savedSession, group),
      };
    }

    if (mate) {
      const session = this.sessionRepository.create({
        session_id,
        create_by: uid,
        chat_type: ChatTypeEnum.private,
      });
      session.mate = mate;
      const savedSession = await this.sessionRepository.save(session);
      return {
        session: savedSession,
        senderInfo: this.formatPrivateSenderInfo(uid, savedSession, mate),
      };
    }

    return false;
  }

  /* 验证会话的合法性 */
  async verifySessionLegality(uid: number, session_id: string, id?: number) {
    let sessionWithSenderInfo: SessionWithSenderInfo | false = false;
    if (id) {
      sessionWithSenderInfo = await this.verifySessionByDoubleId(
        uid,
        id,
        session_id,
      );
    } else {
      sessionWithSenderInfo = await this.verifySessionWithCreateBySessionId(
        uid,
        session_id,
      );
    }
    return sessionWithSenderInfo;
  }

  /* 创建并发送消息 */
  async createAndSendMessage(uid: number, data: SendMessageDto) {
    const { session_primary_id, session_id } = data;
    const sessionWithSenderInfo = await this.verifySessionLegality(
      uid,
      session_id,
      session_primary_id,
    );
    if (!sessionWithSenderInfo) {
      return false;
    }
    const { session, senderInfo } = sessionWithSenderInfo;
    const result = await this.messageService.addMessage({
      ...data,
      session_primary_id: session.id,
      sender_id: uid,
      create_by: uid,
    });
    if (result.code == 0) {
      const message = result.data as MessageEntity;
      session.lastMsg = message;
      session.update_by = uid;
      await this.sessionRepository.save(session);
      return {
        message,
        senderInfo,
      };
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

  /* 分页查询会话消息 */
  async findAllSessionMessages(
    uid: number,
    session_id: string,
    query: FindAllDto,
  ) {
    const session = await this.verifySessionBySessionId(uid, session_id);
    if (!session) {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
    return this.messageService.findAllBySessionId(session.id, query);
  }
}
