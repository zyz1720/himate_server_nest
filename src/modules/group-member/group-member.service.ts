import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  GroupMemberEntity,
  MemberRoleEnum,
  MemberStatusEnum,
} from './entity/group-member.entity';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import {
  AppUpdateGroupMemberDto,
  UpdateGroupMemberAuthDto,
  UpdateGroupMemberDto,
} from './dto/update-group-member.dto';
import { FindAllGroupMemberDto } from './dto/find-all-group-member.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { UserEntity } from '../user/entity/user.entity';
import { GroupEntity } from '../group/entity/group.entity';
import { FindAllDto, IdsDto } from 'src/common/dto/common.dto';

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

  /* 批量软删除群成员 */
  async softDeleteGroupMembers(ids: number[]) {
    const result = await this.groupMemberRepository.softDelete(ids);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 批量软删除非管理员群成员 */
  async deleteNormalGroupMembers(ids: number[]) {
    const result = await this.groupMemberRepository
      .createQueryBuilder('group_member')
      .softDelete()
      .where('id IN (:...ids) AND member_role = :role', {
        ids,
        role: MemberRoleEnum.member,
      })
      .execute();
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 修改非群主和管理员的权限 */
  async updateNormalGroupMemberAuth(
    id: number,
    data: {
      member_role?: MemberRoleEnum;
      member_status?: MemberStatusEnum;
    },
  ) {
    const { member_role, member_status } = data;
    const result = await this.groupMemberRepository
      .createQueryBuilder('group_member')
      .update()
      .set({
        member_role,
        member_status,
      })
      .where('id = :id AND member_role = :role', {
        id,
        role: MemberRoleEnum.member,
      })
      .execute();
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 查询用户是否是群成员 */
  async findUserIsMember(
    uid: number,
    id: number,
    role?: MemberRoleEnum,
    status?: MemberStatusEnum,
  ) {
    const qb = this.groupMemberRepository
      .createQueryBuilder('group_member')
      .where('group_primary_id = :id AND user_id = :uid', {
        id,
        uid,
      });
    if (role) {
      qb.andWhere('member_role = :role', { role });
    }
    if (status) {
      qb.andWhere('member_status = :status', { status });
    }
    const member = await qb.getOne();
    return member;
  }

  /* 查询所有群成员 */
  async findAllGroupMemberByGroupId(
    uid: number,
    groupId: number,
    query: FindAllDto,
  ) {
    const { current = 1, pageSize = 10 } = query || {};
    // 检查用户是否是群成员
    const isMember = await this.findUserIsMember(uid, groupId);
    if (!isMember) {
      return Response.fail(this.i18n.t('message.NO_PERMISSION'));
    }

    const qb = this.groupMemberRepository
      .createQueryBuilder('group_member')
      .where('group_primary_id = :groupId', { groupId })
      .leftJoin('group_member.user', 'user')
      .select([
        'group_member.id',
        'group_member.user_id',
        'group_member.member_remarks',
        'group_member.member_role',
        'group_member.member_status',
        'group_member.create_time',
        'user.id',
        'user.user_name',
        'user.user_avatar',
      ])
      .orderBy('group_member.create_time', 'ASC')
      .limit(pageSize)
      .offset(pageSize * (current - 1));
    const total = await qb.getCount();
    const list = await qb.getMany();

    return PageResponse.list(list, total);
  }

  /* 邀请群成员 */
  async addUserGroupMember(uid: number, groupId: number, data: IdsDto) {
    const { ids } = data;
    // 使用事务保证操作一致性
    const queryRunner =
      this.groupMemberRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const group = await queryRunner.manager.findOne(GroupEntity, {
        where: { id: groupId },
      });
      if (!group) {
        return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
      }

      const members = await queryRunner.manager.find(GroupMemberEntity, {
        where: { user_id: In(ids), group_primary_id: groupId },
        select: ['id', 'user_id'],
      });
      // 检查是否有重复用户
      const existingUserIds = members.map((member) => member.user_id);
      const nonExistingUserIds = ids.filter(
        (id) => !existingUserIds.includes(id),
      );

      if (nonExistingUserIds.length == 0) {
        return Response.fail(this.i18n.t('message.DATA_EXIST'));
      }

      // 获取所有用户信息（包括创建者和成员）
      const users = await queryRunner.manager.find(UserEntity, {
        where: { id: In(nonExistingUserIds) },
        select: ['id', 'user_name'],
      });

      // 创建用户ID到用户名的映射
      const userIdToName = new Map<number, string>();
      users.forEach((user) => {
        userIdToName.set(user.id, user.user_name);
      });

      const groupMembers = [];

      nonExistingUserIds.forEach((userId) => {
        if (userId !== uid) {
          groupMembers.push(
            queryRunner.manager.create(GroupMemberEntity, {
              group_primary_id: groupId,
              user_id: userId,
              member_remarks: userIdToName.get(userId) || '未知用户',
              member_role: MemberRoleEnum.member,
            }),
          );
        }
      });
      await queryRunner.manager.save(GroupMemberEntity, groupMembers);
      await queryRunner.commitTransaction();
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('邀请群成员失败:', error);
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    } finally {
      await queryRunner.release();
    }
  }

  /* 用户移除群成员 */
  async removeUserGroupMembers(uid: number, groupId: number, data: IdsDto) {
    const { ids } = data;
    const member = await this.findUserIsMember(uid, groupId);
    if (!member) {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
    if (
      member.member_role !== MemberRoleEnum.owner &&
      member.member_role !== MemberRoleEnum.admin
    ) {
      return Response.fail(this.i18n.t('message.PERMISSION_DENIED'));
    }
    if (member.member_role == MemberRoleEnum.owner) {
      const excludeSelfIds = ids.filter((id) => id !== member.id);
      return this.softDeleteGroupMembers(excludeSelfIds);
    }
    if (member.member_role == MemberRoleEnum.admin) {
      return this.deleteNormalGroupMembers(ids);
    }
  }

  /* 用户自己移除群成员 */
  async removeOneselfMember(uid: number, groupId: number) {
    const member = await this.findUserIsMember(uid, groupId);
    if (!member) {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
    if (member.member_role == MemberRoleEnum.owner) {
      return Response.fail(this.i18n.t('message.NO_ALLOW'));
    }
    return this.softDeleteGroupMember(member.id);
  }

  /* 更新群成员信息 */
  async updateUserGroupMember(
    uid: number,
    groupId: number,
    data: AppUpdateGroupMemberDto,
  ) {
    const member = await this.findUserIsMember(uid, groupId);
    if (!member) {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
    return this.updateGroupMember(member.id, data);
  }

  /* 更新群成员权限 */
  async updateUserGroupMemberAuth(
    uid: number,
    groupId: number,
    data: UpdateGroupMemberAuthDto,
  ) {
    const { id, ...updateData } = data;
    if (updateData.member_role == MemberRoleEnum.owner) {
      return Response.fail(this.i18n.t('message.NO_ALLOW'));
    }
    const member = await this.findUserIsMember(uid, groupId);
    if (!member) {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
    if (member.member_role == MemberRoleEnum.member) {
      return Response.fail(this.i18n.t('message.NO_PERMISSION'));
    }
    if (member.member_role == MemberRoleEnum.owner) {
      if (member.id == id) {
        return Response.fail(this.i18n.t('message.NO_ALLOW'));
      }
      return this.updateGroupMember(id, updateData);
    }
    if (member.member_role == MemberRoleEnum.admin) {
      return this.updateNormalGroupMemberAuth(id, updateData);
    }
  }

  /* 用户在群组中的信息 */
  async findUserInGroupInfo(uid: number, group_id: string) {
    const member = await this.groupMemberRepository.findOne({
      relations: ['group'],
      where: {
        user_id: uid,
        group: {
          group_id: group_id,
        },
      },
      select: [
        'id',
        'user_id',
        'member_role',
        'member_status',
        'member_remarks',
      ],
    });
    return member;
  }
}
