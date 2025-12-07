import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GroupEntity } from './entity/group.entity';
import { AddGroupDto } from './dto/add-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {
  AppAppFindAllGroupDto,
  FindAllGroupDto,
} from './dto/find-all-group.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { IdsDto } from 'src/common/dto/common.dto';
import { GroupMemberService } from '../group-member/group-member.service';
import { UserEntity } from '../user/entity/user.entity';
import {
  GroupMemberEntity,
  MemberRoleEnum,
  MemberStatusEnum,
} from '../group-member/entity/group-member.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly i18n: I18nService,
    private readonly groupMemberService: GroupMemberService,
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

  /* 用户创建群组 */
  async addUserGroup(uid: number, data: IdsDto) {
    const { ids } = data || {};

    // 使用事务保证操作一致性
    const queryRunner =
      this.groupRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 获取所有用户信息（包括创建者和成员）
      const allUserIds = [uid, ...ids];
      const users = await queryRunner.manager.find(UserEntity, {
        where: { id: In(allUserIds) },
        select: ['id', 'user_name'],
      });

      // 创建用户ID到用户名的映射
      const userIdToName = new Map<number, string>();
      users.forEach((user) => {
        userIdToName.set(user.id, user.user_name);
      });

      // 创建群组
      const groupName = `${userIdToName.get(uid) || '用户'}的群组`;
      const group = queryRunner.manager.create(GroupEntity, {
        group_name: groupName,
      });
      const groupRes = await queryRunner.manager.save(group);

      // 创建群成员记录
      const groupMembers = [];
      groupMembers.push(
        queryRunner.manager.create(GroupMemberEntity, {
          group_primary_id: groupRes.id,
          user_id: uid,
          member_remarks: userIdToName.get(uid) || '未知用户',
          member_role: MemberRoleEnum.owner,
        }),
      );

      // 添加其他成员
      ids.forEach((userId) => {
        if (userId !== uid) {
          groupMembers.push(
            queryRunner.manager.create(GroupMemberEntity, {
              group_primary_id: groupRes.id,
              user_id: userId,
              member_remarks: userIdToName.get(userId) || '未知用户',
              member_role: MemberRoleEnum.member,
            }),
          );
        }
      });
      await queryRunner.manager.save(GroupMemberEntity, groupMembers);

      // 提交事务
      await queryRunner.commitTransaction();
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), groupRes);
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      console.error('创建群组失败:', error);
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    } finally {
      // 释放queryRunner
      await queryRunner.release();
    }
  }

  /* 查询用户群组 */
  async findAllUserGroup(uid: number, query: AppAppFindAllGroupDto) {
    const { member_role, current = 1, pageSize = 10 } = query || {};
    const qb = this.groupRepository
      .createQueryBuilder('group')
      .leftJoin('group.members', 'member')
      .where('member.user_id = :uid AND member.member_role = :role', {
        uid,
        role: member_role,
      })
      .orderBy('group.create_time', 'DESC');
    const count = await qb.getCount();
    const data = await qb
      .offset((current - 1) * pageSize)
      .limit(pageSize)
      .getMany();
    return PageResponse.list(data, count);
  }

  /* 查询用户群组详情 */
  async findOneUserGroup(uid: number, id: number) {
    // 检查用户是否属于该群组
    const member = await this.groupMemberService.findUserIsMember(uid, id);
    if (!member) {
      return Response.fail(this.i18n.t('message.NO_PERMISSION'));
    }
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'members')
      .where('group.id = :id', { id })
      .select([
        'group.id',
        'group.group_id',
        'group.group_name',
        'group.group_avatar',
        'group.group_introduce',
        'members.user_id',
      ])
      .getOne();

    return group;
  }

  /* 修改用户群组信息 */
  async updateUserGroup(uid: number, id: number, data: UpdateGroupDto) {
    // 检查用户是否属于该群组
    const member = await this.groupMemberService.findUserIsMember(uid, id);
    if (!member) {
      return Response.fail(this.i18n.t('message.NO_PERMISSION'));
    }
    if (
      member.member_role !== MemberRoleEnum.owner &&
      member.member_role !== MemberRoleEnum.admin
    ) {
      return Response.fail(this.i18n.t('message.NO_PERMISSION'));
    }
    return this.updateGroup(id, data);
  }

  /* 解散群组 */
  async deleteUserGroup(uid: number, id: number) {
    // 检查用户是否属于该群组
    const member = await this.groupMemberService.findUserIsMember(uid, id);
    if (!member) {
      return Response.fail(this.i18n.t('message.NO_PERMISSION'));
    }
    if (member.member_role !== MemberRoleEnum.owner) {
      return Response.fail(this.i18n.t('message.NO_PERMISSION'));
    }
    return this.softDeleteGroup(id);
  }

  /* group_id 验证用户是否属于群组且状态正常 */
  async findOneGroupMemberBase(uid: number, group_id: string) {
    const group = await this.groupRepository.findOne({
      relations: ['members', 'members.user'],
      where: {
        group_id: group_id,
        members: {
          user_id: uid,
          member_status: MemberStatusEnum.normal,
        },
      },
      select: {
        id: true,
        group_id: true,
        members: {
          user_id: true,
          member_remarks: true,
          user: {
            user_avatar: true,
          },
        },
      },
    });
    return group;
  }

  /* 查询用户存在的群组group_id */
  async findAllUserExistGroup(uid: number) {
    const groupIds = await this.groupRepository.find({
      relations: ['members'],
      where: {
        members: {
          user_id: uid,
        },
      },
      select: ['group_id'],
    });
    return groupIds;
  }

  /* 查询指定群组的基本信息 */
  async findOneGroupBase(group_id: string) {
    const result = await this.groupRepository.findOne({
      where: { group_id },
      select: ['id', 'group_name', 'group_avatar'],
    });
    return result;
  }
}
