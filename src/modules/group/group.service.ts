import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { groupEntity } from 'src/entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { ResultList, ResultMsg } from 'src/commom/utils/result';
import { Msg } from 'src/commom/constants/base-msg.const';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FindAllGroupDto } from './dto/findall-group.dto';
import { UserService } from '../user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GroupDeleteEvent } from './events/delete-group.event';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';
import {
  GroupMemberRole,
  NumericStatus,
} from 'src/commom/constants/base-enum.const';
import { GroupIdsDto } from './dto/group-id.dto';
import { FindOneGroupDto } from './dto/findone-group.dto';

interface ICheckUserGroupPermission {
  id?: number;
  group_id?: string;
  member_uid: number;
}

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(groupEntity)
    private readonly groupRepository: Repository<groupEntity>,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  /* 创建群组 */
  async createGroup(data: CreateGroupDto) {
    const { creator_uid } = data || {};
    const userRes = await this.userService.findOneUser({ id: creator_uid });
    if (userRes) {
      const newData = {
        creator_uid,
        group_name: userRes.user_name + '的群聊',
        ...data,
      };
      const newGroup = this.groupRepository.create(newData);
      const insertRes = await this.groupRepository.insert(newGroup);
      if (insertRes.identifiers.length) {
        return ResultMsg.ok(Msg.CREATE_SUCCESS, newGroup);
      } else {
        return ResultMsg.fail(Msg.CREATE_FAIL);
      }
    } else {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
  }

  /* 查询所有群 */
  async findAllGroup(query: FindAllGroupDto) {
    const qb = this.groupRepository.createQueryBuilder('group');
    const count = await qb.getCount();
    const {
      pageNum = 0,
      pageSize = 10,
      creator_uid,
      group_name,
      group_status,
      gIdList,
      ids,
      isPaging = NumericStatus.True,
    } = query || {};
    if (gIdList) {
      qb.andWhere('group_id IN (:...gIdList)', { gIdList });
    }
    if (ids) {
      qb.andWhere('id IN (:...ids)', { ids });
    }
    if (creator_uid) {
      qb.andWhere('creator_uid = :uid', { uid: creator_uid });
    }
    if (group_name) {
      qb.andWhere('group_name = :name', { name: group_name });
    }
    if (group_status) {
      qb.andWhere('group_status = :status', { status: group_status });
    }
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * pageNum);
    }
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /* 查询一个群详情 */
  async findOneGroup(query: FindOneGroupDto) {
    const { id, group_id, creator_uid, group_name, group_status, member_uid } =
      query || {};
    const qb = this.groupRepository.createQueryBuilder('group');
    qb.leftJoinAndSelect('group.members', 'members');
    if (id) {
      qb.andWhere('group.id = :id', { id });
    }
    if (group_id) {
      qb.andWhere('group.group_id = :g_id', { g_id: group_id });
    }
    if (group_name) {
      qb.andWhere('group.group_name = :g_name', { g_name: group_name });
    }
    if (group_status) {
      qb.andWhere('group.group_status = :g_status', { g_status: group_status });
    }
    if (creator_uid) {
      qb.andWhere('group.creator_uid = :c_uid', { c_uid: creator_uid });
    }
    if (member_uid) {
      qb.andWhere('members.member_uid = :m_uid', { m_uid: member_uid });
    }
    const group = await qb.getOne();
    return group;
  }

  /*  修改群信息 */
  async updateGroup(data: UpdateGroupDto, uid?: number) {
    const { id } = data || {};
    // 如果有uid参数，检查用户权限
    if (uid) {
      const group = await this.checkUserGroupPermission({
        id,
        member_uid: uid,
      });
      if (!group) {
        return ResultMsg.fail(Msg.NO_PERMISSION);
      }
    }
    const updateRes = await this.groupRepository
      .createQueryBuilder('group')
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes.generatedMaps[0]);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 检查用户权限 */
  async checkUserGroupPermission(data: ICheckUserGroupPermission) {
    const { id, group_id, member_uid } = data || {};
    const qb = this.groupRepository.createQueryBuilder('group');
    qb.leftJoinAndSelect('group.members', 'member');
    if (id) {
      qb.andWhere('group.id = :id', { id });
    }
    if (group_id) {
      qb.andWhere('group.group_id = :group_id', { group_id });
    }
    qb.andWhere('member.member_uid = :uid', { uid: member_uid });
    qb.andWhere('member.member_role IN (:...roles)', {
      roles: [GroupMemberRole.Admin, GroupMemberRole.Owner],
    });
    const group = await qb.getOne();
    return group;
  }

  /* 软删除群组 */
  async softDeleteGroup(data: GroupIdsDto, uid?: number) {
    const { group_ids } = data || {};
    const qb = this.groupRepository.createQueryBuilder('group');
    qb.where('group_id IN (:...ids)', { ids: group_ids });
    if (uid) {
      qb.andWhere('creator_uid = :uid', { uid });
    }
    const delRes = await qb.softDelete().execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 恢复群组 */
  async restoreGroup(data: GroupIdsDto) {
    const { group_ids = [] } = data || {};
    const delRes = await this.groupRepository
      .createQueryBuilder('group')
      .restore()
      .where('group_id IN (:...ids)', { ids: group_ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_RESTORE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.RESTORE_FAIL);
    }
  }

  /*  真删除群组 */
  async deleteGroup(data: GroupIdsDto) {
    const { group_ids } = data || {};
    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_groupRepository =
        this.queryRunnerFactory.getRepository(groupEntity);
      // 数据库操作
      const delRes = await tx_groupRepository
        .createQueryBuilder('group')
        .delete()
        .where('group_id IN (:...ids)', { ids: group_ids })
        .andWhere('delete_time IS NOT NULL')
        .execute();
      if (delRes.affected) {
        const eventFlags = await this.eventEmitter.emitAsync(
          'group.deleted',
          new GroupDeleteEvent(group_ids),
        );
        // 事件有失败事务回滚
        if (eventFlags.includes(false)) {
          await this.queryRunnerFactory.rollbackTransaction();
          return ResultMsg.fail(Msg.DELETE_FAIL);
        }
        await this.queryRunnerFactory.commitTransaction();
        return ResultMsg.ok(Msg.DELETE_SUCCESS);
      } else {
        await this.queryRunnerFactory.rollbackTransaction();
        return ResultMsg.fail(Msg.DELETE_FAIL);
      }
    } catch (error) {
      await this.queryRunnerFactory.rollbackTransaction();
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }
}
