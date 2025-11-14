import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entity/message.entity';
import { AddMessageDto } from './dto/add-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FindAllMessageDto } from './dto/find-all-message.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

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
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
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
}
