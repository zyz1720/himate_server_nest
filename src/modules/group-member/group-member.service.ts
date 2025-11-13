import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMemberEntity } from './entity/group-member.entity';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { FindAllGroupMemberDto } from './dto/find-all-group-member.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMemberEntity)
    private readonly groupMemberRepository: Repository<GroupMemberEntity>,
    private readonly i18n: I18nService,
  ) {}

  /* 添加一个群成员 */
  async addGroupMember(data: AddGroupMemberDto) {
    const entityData = this.groupMemberRepository.create(data);
    const insertRes = await this.groupMemberRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有群成员 */
  async findAllGroupMember(query: FindAllGroupMemberDto) {
    const {
      current = 1,
      pageSize = 10,
      group_id,
      user_id,
      member_remarks,
      member_role,
      member_status,
    } = query || {};
    const qb = this.groupMemberRepository.createQueryBuilder('group_member');
    if (group_id) {
      qb.andWhere('group_id LIKE :group_id', {
        group_id: '%' + group_id + '%',
      });
    }
    if (user_id) {
      qb.andWhere('user_id = :user_id', {
        user_id: user_id,
      });
    }
    if (member_remarks) {
      qb.andWhere('member_remarks LIKE :member_remarks', {
        member_remarks: '%' + member_remarks + '%',
      });
    }
    if (member_role) {
      qb.andWhere('member_role = :member_role', {
        member_role: member_role,
      });
    }
    if (member_status) {
      qb.andWhere('member_status = :member_status', {
        member_status: member_status,
      });
    }

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 查询指定群成员 */
  async findOneGroupMember(id: number) {
    const result = await this.groupMemberRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
  }

  /* 修改群成员信息 */
  async updateGroupMember(id: number, data: UpdateGroupMemberDto) {
    const result = await this.groupMemberRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除群成员 */
  async softDeleteGroupMember(id: number) {
    const result = await this.groupMemberRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复群成员 */
  async restoreGroupMember(id: number) {
    const result = await this.groupMemberRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除群成员 */
  async deleteGroupMember(id: number) {
    const result = await this.groupMemberRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }
}
