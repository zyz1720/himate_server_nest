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
import { createUUID } from 'src/commom/utils/base';
import { NumericStatus } from 'src/commom/constants/base-enum.const';

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
      const group_id = createUUID();
      console.log('groupId', group_id);

      const newData = {
        creator_uid,
        group_name: userRes.user_name + '的群聊',
        group_id,
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
      isPaging = NumericStatus.True,
    } = query || {};
    if (gIdList) {
      qb.where('group.group_id IN (:...gIdList)', { gIdList });
    }
    if (creator_uid) {
      qb.andWhere('group.creator_uid = :uid', { uid: creator_uid });
    }
    if (group_name) {
      qb.andWhere('group.group_name = :name', { name: group_name });
    }
    if (group_status) {
      qb.andWhere('group.group_status = :status', { status: group_status });
    }
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * pageNum);
    }
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /* 查询一个群详情 */
  async findOneGroup(id: number) {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'members')
      .where('group.id = :id', { id })
      .getOne();
    return group;
  }

  /* 查询群详情通过随机群id */
  async findOneGroupBygroupId(gId: string) {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'members')
      .where('group.group_id = :gId', { gId })
      .getOne();
    return group;
  }

  /*  修改群信息 */
  async updateGroup(data: UpdateGroupDto) {
    const { id } = data || {};
    const group = await this.findOneGroup(id);
    if (!group) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
    const updateRes = await this.groupRepository
      .createQueryBuilder('group')
      .update()
      .set({ ...data })
      .where('group.id = :id', { id })
      .execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes.generatedMaps[0]);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /*  删除群组 */
  async removeGroup(id: number) {
    const group = await this.findOneGroup(id);
    if (!group) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
    if (group) {
      try {
        // 开启事务
        await this.queryRunnerFactory.startTransaction();
        const tx_groupRepository =
          this.queryRunnerFactory.getRepository(groupEntity);
        // 数据库操作
        const delRes = await tx_groupRepository
          .createQueryBuilder('group')
          .delete()
          .where('group.id = :id', { id })
          .execute();
        if (delRes.affected) {
          const eventFlags = await this.eventEmitter.emitAsync(
            'group.deleted',
            new GroupDeleteEvent(group.group_id),
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
}
