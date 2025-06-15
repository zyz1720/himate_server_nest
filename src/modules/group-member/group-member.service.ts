import { Injectable } from '@nestjs/common';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { groupMemberEntity } from 'src/entities/group-member.entity';
import { ResultList, ResultMsg } from 'src/commom/utils/result';
import { Msg } from 'src/commom/constants/base-msg.const';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/group.service';
import { FindJoinGroupDto } from './dto/findjoin-group.dto';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';
import { FindOneGroupMemberDto } from './dto/findOne-group-member.dto';
import {
  GroupMemberRole,
  NumericStatus,
} from 'src/commom/constants/base-enum.const';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(groupMemberEntity)
    private readonly groupmemberRepository: Repository<groupMemberEntity>,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  /* 创建群成员 */
  async createGroupMember(data: CreateGroupMemberDto, uid: number) {
    const { member_uid, member_remark, gId, group_id } = data || {};
    const userRes = await this.userService.findOneUser({ id: member_uid });
    if (!userRes) {
      return ResultMsg.fail('不存在的用户');
    }
    const group = await this.groupService.findOneGroup({ id: gId, group_id });
    if (!group) {
      return ResultMsg.fail('不存在的群组/id不正确');
    }
    const member = await this.findOneGroupMember({ member_uid, group_id });
    if (member) {
      return ResultMsg.fail('已加入过该群组');
    }
    if (uid) {
      const inGroup = await this.groupService.findOneGroup({
        id: gId,
        member_uid: uid,
      });
      if (!inGroup) {
        return ResultMsg.fail(Msg.NO_PERMISSION);
      }
    }
    const newData = {
      member_avatar: userRes.user_avatar,
      member_remark: member_remark ? member_remark : userRes.user_name,
      member_role:
        group.creator_uid === member_uid
          ? GroupMemberRole.Owner
          : GroupMemberRole.Member,
      ...data,
    };
    try {
      let Result = null;
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_groupmemberRepository =
        this.queryRunnerFactory.getRepository(groupMemberEntity);
      // 执行一些数据库操作
      const newMember = tx_groupmemberRepository.create(newData);
      const insertRes = await tx_groupmemberRepository.insert(newMember);
      if (insertRes.identifiers.length) {
        newMember.group = group;
        const saveRes = await tx_groupmemberRepository.save(newMember);
        if (saveRes) {
          Result = saveRes;
        }
      }
      if (Result) {
        await this.queryRunnerFactory.commitTransaction();
        return ResultMsg.ok(Msg.CREATE_SUCCESS, Result);
      } else {
        await this.queryRunnerFactory.rollbackTransaction();
        return ResultMsg.fail(Msg.CREATE_FAIL);
      }
    } catch (error) {
      await this.queryRunnerFactory.rollbackTransaction();
      return ResultMsg.fail(Msg.CREATE_FAIL);
    }
  }

  /* 查询群一个成员信息 */
  async findOneGroupMember(query: FindOneGroupMemberDto, uid?: number) {
    const {
      id,
      group_id,
      member_uid,
      member_role,
      member_remark,
      member_status,
    } = query || {};
    const qb = this.groupmemberRepository.createQueryBuilder('group_member');
    if (id) {
      qb.andWhere('id = :id', { id });
    }
    if (group_id) {
      qb.andWhere('group_id = :group_id', { group_id });
    }
    if (member_uid) {
      qb.andWhere('member_uid = :member_uid', { member_uid });
    }
    if (member_role) {
      qb.andWhere('member_role = :member_role', { member_role });
    }
    if (member_remark) {
      qb.andWhere('member_remark = :member_remark', {
        member_remark,
      });
    }
    if (member_status) {
      qb.andWhere('member_status = :member_status', {
        member_status,
      });
    }
    if (uid) {
      qb.andWhere('member_uid = :uid', { uid });
    }
    const member = await qb.getOne();
    return member;
  }

  /* 查询用户加入的所有群组详情*/
  findAllJoinGroupDetail = async (query: FindJoinGroupDto, uid?: number) => {
    const { pageNum, pageSize, uid: user_uid } = query || {};
    const qb = this.groupmemberRepository.createQueryBuilder('group_member');
    qb.where('member_uid = :uid', { uid: user_uid });
    if (uid) {
      qb.andWhere('member_uid = :uid', { uid });
    }
    const data = await qb.getMany();
    let newlist = [];

    if (data.length) {
      newlist = data.map((item) => {
        return item.group_id;
      });
    }
    if (newlist.length) {
      return await this.groupService.findAllGroup({
        gIdList: newlist,
        pageNum,
        pageSize,
      });
    }
    return ResultList.list();
  };

  /* 修改群成员信息 */
  async updateGroupMember(data: UpdateGroupMemberDto, uid?: number) {
    const { id, member_role } = data || {};
    const updateData = { ...data };
    const member = await this.findOneGroupMember({ id });
    if (!member) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }

    if (uid) {
      const inGroup = await this.groupService.findOneGroup({
        group_id: member.group_id,
        member_uid: uid,
      });

      if (!inGroup) {
        return ResultMsg.fail(Msg.NO_PERMISSION);
      }
      const memberSelf = inGroup.members[0];
      switch (memberSelf.member_role) {
        case GroupMemberRole.Member:
          delete updateData.member_role;
          delete updateData.member_status;
          if (uid != member.member_uid) {
            return ResultMsg.fail(Msg.NO_PERMISSION);
          }
          break;
        case GroupMemberRole.Admin:
          if (member_role == GroupMemberRole.Owner) {
            delete updateData.member_role;
          }
          if (
            member.member_role == GroupMemberRole.Admin ||
            member.member_role == GroupMemberRole.Owner
          ) {
            return ResultMsg.fail(Msg.NO_PERMISSION);
          }
          break;
        case GroupMemberRole.Owner:
          if (member.member_uid == uid) {
            delete updateData.member_role;
            delete updateData.member_status;
          }
          break;
        default:
          break;
      }
    }

    const updateRes = await this.groupmemberRepository
      .createQueryBuilder('group_member')
      .update()
      .set({ ...updateData })
      .where('id = :id', { id })
      .execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 删除单个群成员 */
  async removeGroupMember(id: number, uid?: number) {
    const member = await this.findOneGroupMember({ id });
    if (!member) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
    if (uid) {
      const inGroup = await this.groupService.findOneGroup({
        group_id: member.group_id,
        member_uid: uid,
      });
      if (!inGroup) {
        return ResultMsg.fail(Msg.NO_PERMISSION);
      }
      if (inGroup.creator_uid == uid) {
        return ResultMsg.fail(Msg.NO_ALLOW);
      }
      const memberSelf = inGroup.members[0];

      switch (memberSelf.member_role) {
        case GroupMemberRole.Member:
          if (uid != member.member_uid) {
            return ResultMsg.fail(Msg.NO_PERMISSION);
          }
          break;
        case GroupMemberRole.Admin:
          if (
            member.member_role == GroupMemberRole.Admin ||
            member.member_role == GroupMemberRole.Owner
          ) {
            return ResultMsg.fail(Msg.NO_PERMISSION);
          }
          break;
        case GroupMemberRole.Owner:
          if (member.member_uid == uid) {
            return ResultMsg.fail(Msg.NO_ALLOW);
          }
          break;
        default:
          break;
      }
    }
    const delRes = await this.groupmemberRepository
      .createQueryBuilder('group_member')
      .softDelete()
      .where('id = :id', { id })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 删除一个群下的所有群成员 */
  async removeMoreGroupMember(gId: string, uid?: number) {
    if (uid) {
      const member = await this.findOneGroupMember({
        group_id: gId,
        member_uid: uid,
      });
      if (!member) {
        return ResultMsg.fail(Msg.DATA_NOEXIST);
      }
      if (member.member_role != GroupMemberRole.Owner) {
        return ResultMsg.fail(Msg.NO_PERMISSION);
      }
    }

    const delRes = await this.groupmemberRepository
      .createQueryBuilder('group_member')
      .softDelete()
      .where('group_id = :gId', { gId })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 恢复一个群下的所有群成员 */
  async restoreMoreGroupMember(gId: string) {
    const delRes = await this.groupmemberRepository
      .createQueryBuilder('group_member')
      .restore()
      .where('group_id = :gId', { gId })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_RESTORE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.RESTORE_FAIL);
    }
  }
}
