import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MateEntity } from './entity/mate.entity';
import { AddMateDto } from './dto/add-mate.dto';
import { UpdateMateDto } from './dto/update-mate.dto';
import { FindAllMateDto } from './dto/find-all-mate.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MateService {
  constructor(
    @InjectRepository(MateEntity)
    private readonly mateRepository: Repository<MateEntity>,
    private readonly i18n: I18nService,
  ) {}

  /* 添加一个好友 */
  async addMate(data: AddMateDto) {
    const entityData = this.mateRepository.create(data);
    const insertRes = await this.mateRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有好友 */
  async findAllMate(query: FindAllMateDto) {
    const {
      current = 1,
      pageSize = 10,
      mate_id,
      user_id,
      friend_id,
      mate_status,
    } = query || {};
    const qb = this.mateRepository.createQueryBuilder('mate');
    if (mate_id) {
      qb.andWhere('mate_id LIKE :mate_id', {
        mate_id: '%' + mate_id + '%',
      });
    }
    if (user_id) {
      qb.andWhere('user_id = :user_id', {
        user_id: user_id,
      });
    }
    if (friend_id) {
      qb.andWhere('friend_id = :friend_id', {
        friend_id: friend_id,
      });
    }
    if (mate_status) {
      qb.andWhere('mate_status = :mate_status', {
        mate_status: mate_status,
      });
    }

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 查询指定好友 */
  async findOneMate(id: number) {
    const result = await this.mateRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
  }

  /* 修改好友信息 */
  async updateMate(id: number, data: UpdateMateDto) {
    const result = await this.mateRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除好友 */
  async softDeleteMate(id: number) {
    const result = await this.mateRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复好友 */
  async restoreMate(id: number) {
    const result = await this.mateRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除好友 */
  async deleteMate(id: number) {
    const result = await this.mateRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }
}
