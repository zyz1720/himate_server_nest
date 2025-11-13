import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from './entity/session.entity';
import { AddSessionDto } from './dto/add-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FindAllSessionDto } from './dto/find-all-session.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly i18n: I18nService,
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
}
