import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { MessageEntity } from './entity/message.entity';
import { AddMessageDto } from './dto/add-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FindAllMessageDto } from './dto/find-all-message.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { FindAllDto, IdsDto } from 'src/common/dto/common.dto';
import { ChatTypeEnum } from 'src/modules/session/entity/session.entity';
import { MessageWithSenderInfo } from '../session/types/session-response.type';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly i18n: I18nService,
  ) {}

  /* 添加一个消息 */
  async addMessage(data: AddMessageDto) {
    const entityData = this.messageRepository.create(data);
    const insertRes = await this.messageRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有消息 */
  async findAllMessage(query: FindAllMessageDto) {
    const {
      current = 1,
      pageSize = 10,
      client_msg_id,
      session_primary_id,
      sender_id,
      sender_ip,
      msg_type,
    } = query || {};
    const qb = this.messageRepository.createQueryBuilder('message');
    if (client_msg_id) {
      qb.andWhere('client_msg_id LIKE :client_msg_id', {
        client_msg_id: '%' + client_msg_id + '%',
      });
    }
    if (session_primary_id) {
      qb.andWhere('session_primary_id LIKE :id', {
        id: '%' + session_primary_id + '%',
      });
    }
    if (sender_id) {
      qb.andWhere('sender_id = :sender_id', {
        sender_id: sender_id,
      });
    }
    if (sender_ip) {
      qb.andWhere('sender_ip LIKE :sender_ip', {
        sender_ip: '%' + sender_ip + '%',
      });
    }
    if (msg_type) {
      qb.andWhere('msg_type = :msg_type', {
        msg_type: msg_type,
      });
    }
    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 查询指定消息 */
  async findOneMessage(id: number) {
    const result = await this.messageRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
    }
  }

  /* 修改消息信息 */
  async updateMessage(id: number, data: UpdateMessageDto) {
    const result = await this.messageRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除消息 */
  async softDeleteMessage(id: number) {
    const result = await this.messageRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复消息 */
  async restoreMessage(id: number) {
    const result = await this.messageRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除消息 */
  async deleteMessage(id: number) {
    const result = await this.messageRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 查询指定消息id列表 */
  async findMessageIdsByIds(ids: number[] = []) {
    const result = await this.messageRepository
      .createQueryBuilder('message')
      .select('message.id')
      .where('message.id IN (:...ids)', { ids })
      .getRawMany();
    return result;
  }

  /* 查询用户所有消息 */
  async findAllUserMessage(uid: number, query: FindAllDto) {
    const { current = 1, pageSize = 10 } = query || {};
    const qb = this.messageRepository.createQueryBuilder('message');
    qb.where('message.sender_id = :uid', { uid });
    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const [data, count] = await qb.getManyAndCount();

    return PageResponse.list(data, count);
  }

  /* 批量删除用户消息 */
  async softDeleteUserMessages(uid: number, data: IdsDto) {
    const { ids } = data || {};
    const result = await this.messageRepository.softDelete({
      id: In(ids),
      sender_id: uid,
    });
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 查询会话下的所有消息的详细信息 */
  async findAllBySessionId(sessionId: number, query: FindAllDto) {
    const { current = 1, pageSize = 10 } = query || {};

    const qb = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin(
        'message.session',
        'session',
        'session.id = message.session_primary_id',
      )
      .leftJoin('message.user', 'user', 'user.id = message.sender_id')
      .leftJoin('session.group', 'group', 'session.chat_type = :groupType', {
        groupType: ChatTypeEnum.group,
      })
      .leftJoin(
        'group.members',
        'groupMember',
        'groupMember.user_id = message.sender_id AND groupMember.group_primary_id = group.id',
      )
      .leftJoin('session.mate', 'mate', 'session.chat_type = :privateType', {
        privateType: ChatTypeEnum.private,
      })
      .where('message.session_primary_id = :sessionId', { sessionId })
      .orderBy('message.create_time', 'DESC')
      .limit(pageSize)
      .offset(pageSize * (current - 1))
      .select([
        'message',
        'session.chat_type',
        'session.session_id',
        'user.id',
        'user.user_name',
        'user.user_avatar',
        'group.group_id',
        'groupMember.member_remarks',
        'mate.mate_id',
        'mate.friend_id',
        'mate.friend_remarks',
        'mate.user_id',
        'mate.user_remarks',
      ]);

    const [messages, total] = await qb.getManyAndCount();
    const result = messages.map((message) => {
      const { session, user, ...msgData } = message as any;
      const groupMember = session?.group?.members[0] || {};
      const mate = session?.mate || {};

      let remarks = user.user_name;
      if (session.chat_type === ChatTypeEnum.group) {
        remarks = groupMember?.member_remarks || user.user_name;
      } else if (session.chat_type === ChatTypeEnum.private) {
        remarks =
          msgData?.sender_id === mate?.user_id
            ? mate?.user_remarks || user.user_name
            : mate?.friend_remarks || user.user_name;
      }

      return {
        message: msgData,
        senderInfo: {
          chat_type: session.chat_type,
          user_id: user.id,
          remarks,
          avatar: user.user_avatar,
        },
      };
    });

    return PageResponse.list(result, total);
  }

  /* 查询会话下的所有未读消息的详细信息 */
  async findAllUnreadBySessionId(
    uid: number,
    sessionId: number,
    query: FindAllDto,
  ) {
    const { current = 1, pageSize = 10 } = query || {};

    const qb = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin(
        'message.session',
        'session',
        'session.id = message.session_primary_id',
      )
      .leftJoin('message.user', 'user', 'user.id = message.sender_id')
      .leftJoin('session.group', 'group', 'session.chat_type = :groupType', {
        groupType: ChatTypeEnum.group,
      })
      .leftJoin(
        'group.members',
        'groupMember',
        'groupMember.user_id = message.sender_id AND groupMember.group_primary_id = group.id',
      )
      .leftJoin('session.mate', 'mate', 'session.chat_type = :privateType', {
        privateType: ChatTypeEnum.private,
      })
      .leftJoin(
        'message.read_records',
        'readRecords',
        'readRecords.user_id = :uid',
        { uid },
      )
      .where('message.session_primary_id = :sessionId', { sessionId })
      .andWhere('message.sender_id != :uid', { uid })
      .andWhere('readRecords.id IS NULL')
      .orderBy('message.create_time', 'DESC')
      .limit(pageSize)
      .offset(pageSize * (current - 1))
      .select([
        'message',
        'session.chat_type',
        'session.session_id',
        'user.id',
        'user.user_name',
        'user.user_avatar',
        'group.group_id',
        'groupMember.member_remarks',
        'mate.mate_id',
        'mate.friend_id',
        'mate.friend_remarks',
        'mate.user_id',
        'mate.user_remarks',
      ]);

    const [messages, total] = await qb.getManyAndCount();
    const result = messages.map((message) => {
      const { session, user, ...msgData } = message as any;
      const groupMember = session?.group?.members[0] || {};
      const mate = session?.mate || {};

      let remarks = user.user_name;
      if (session.chat_type === ChatTypeEnum.group) {
        remarks = groupMember?.member_remarks || user.user_name;
      } else if (session.chat_type === ChatTypeEnum.private) {
        remarks =
          msgData?.sender_id === mate?.user_id
            ? mate?.user_remarks || user.user_name
            : mate?.friend_remarks || user.user_name;
      }

      const messageWithSenderInfo: MessageWithSenderInfo = {
        message: msgData,
        senderInfo: {
          chat_type: session.chat_type,
          user_id: user.id,
          remarks,
          avatar: user.user_avatar,
        },
      };

      return messageWithSenderInfo;
    });

    return PageResponse.list(result, total);
  }

  /* 查询会话下的所有未读消息 */
  async findAllUnreadIdsBySessionId(
    uid: number,
    sessionId: number,
    query: FindAllDto,
  ) {
    const { current = 1, pageSize = 10 } = query || {};
    const qb = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin(
        'message.read_records',
        'readRecords',
        'readRecords.user_id = :uid',
        { uid },
      )
      .where('message.session_primary_id = :sessionId', { sessionId })
      .andWhere('message.sender_id != :uid', { uid })
      .andWhere('readRecords.id IS NULL')
      .orderBy('message.create_time', 'DESC')
      .limit(pageSize)
      .offset(pageSize * (current - 1))
      .select(['message.id']);

    const [messages, total] = await qb.getManyAndCount();

    return PageResponse.list(messages, total);
  }
}
