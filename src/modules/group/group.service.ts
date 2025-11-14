import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from './entity/group.entity';
import { AddGroupDto } from './dto/add-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FindAllGroupDto } from './dto/find-all-group.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly i18n: I18nService,
  ) {}

  /* 添加一个群组 */
  async addGroup(data: AddGroupDto) {
    const entityData = this.groupRepository.create(data);
    const insertRes = await this.groupRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有群组 */
  async findAllGroup(query: FindAllGroupDto) {
    const { current = 1, pageSize = 10, group_id, group_name } = query || {};
    const qb = this.groupRepository.createQueryBuilder('group');
    if (group_id) {
      qb.andWhere('group_id LIKE :group_id', {
        group_id: '%' + group_id + '%',
      });
    }
    if (group_name) {
      qb.andWhere('group_name LIKE :group_name', {
        group_name: '%' + group_name + '%',
      });
    }
    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 查询指定群组 */
  async findOneGroup(id: number) {
    const result = await this.groupRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
  }

  /* 修改群组信息 */
  async updateGroup(id: number, data: UpdateGroupDto) {
    const result = await this.groupRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除群组 */
  async softDeleteGroup(id: number) {
    const result = await this.groupRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复群组 */
  async restoreGroup(id: number) {
    const result = await this.groupRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除群组 */
  async deleteGroup(id: number) {
    const result = await this.groupRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }
}
