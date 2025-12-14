import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { MessageReadRecordsEntity } from './entity/message-read-records.entity';
import { AddMessageReadRecordsDto } from './dto/add-message-read-records.dto';
import { UpdateMessageReadRecordsDto } from './dto/update-message-read-records.dto';
import { FindAllMessageReadRecordsDto } from './dto/find-all-message-read-records.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MessageReadRecordsService {
  constructor(
    @InjectRepository(MessageReadRecordsEntity)
    private readonly messageReadRecordsRepository: Repository<MessageReadRecordsEntity>,
    private readonly i18n: I18nService,
  ) {}

  /* 添加一个消息读取记录 */
  async addMessageReadRecords(data: AddMessageReadRecordsDto) {
    const entityData = this.messageReadRecordsRepository.create(data);
    const insertRes =
      await this.messageReadRecordsRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 批量添加消息读取记录 */
  async batchAddMessageReadRecords(data: AddMessageReadRecordsDto[]) {
    const existRecords = await this.messageReadRecordsRepository
      .createQueryBuilder('message_read_records')
      .where('user_id IN (:...user_ids)', {
        user_ids: data.map((item) => item.user_id),
      })
      .andWhere('message_id IN (:...message_ids)', {
        message_ids: data.map((item) => item.message_id),
      })
      .select('message_id')
      .getRawMany();

    const newRecords = data.filter(
      (item) =>
        !existRecords.find((record) => record.message_id === item.message_id),
    );
    if (newRecords.length === 0) {
      return Response.fail(this.i18n.t('message.CREATE_SUCCESS'));
    }
    const result = await this.messageReadRecordsRepository.insert(newRecords);
    if (result.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有消息读取记录 */
  async findAllMessageReadRecords(query: FindAllMessageReadRecordsDto) {
    const { current = 1, pageSize = 10, user_id, message_id } = query || {};
    const qb = this.messageReadRecordsRepository.createQueryBuilder(
      'message_read_records',
    );
    if (user_id) {
      qb.andWhere('user_id = :user_id', {
        user_id: user_id,
      });
    }
    if (message_id) {
      qb.andWhere('message_id = :message_id', {
        message_id: message_id,
      });
    }

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const [data, count] = await qb.getManyAndCount();
    return PageResponse.list(data, count);
  }

  /* 查询指定消息读取记录 */
  async findOneMessageReadRecords(id: number) {
    const result = await this.messageReadRecordsRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
    }
  }

  /* 修改消息读取记录信息 */
  async updateMessageReadRecords(
    id: number,
    data: UpdateMessageReadRecordsDto,
  ) {
    const result = await this.messageReadRecordsRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除消息读取记录 */
  async softDeleteMessageReadRecords(id: number) {
    const result = await this.messageReadRecordsRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复消息读取记录 */
  async restoreMessageReadRecords(id: number) {
    const result = await this.messageReadRecordsRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除消息读取记录 */
  async deleteMessageReadRecords(id: number) {
    const result = await this.messageReadRecordsRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 查询会话下的用户读取记录数量 */
  async findCountBySessionId(uid: number, sessionId: number) {
    const count = await this.messageReadRecordsRepository.count({
      where: {
        message: {
          session_primary_id: sessionId,
          sender_id: Not(uid),
        },
        user_id: uid,
      },
    });
    return count;
  }
}
