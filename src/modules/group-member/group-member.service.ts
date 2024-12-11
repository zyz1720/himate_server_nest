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
  async createGroupMember(data: CreateGroupMemberDto) {
    const { member_uid, member_remark, gId, group_id } = data || {};
    const userRes = await this.userService.findOneUser({ id: member_uid });
    if (!userRes) {
      return ResultMsg.fail('不存在的用户');
    }
    const group = await this.groupService.findOneGroup(gId);
    if (!group) {
      return ResultMsg.fail('不存在的群组/id不正确');
    }
    const member = await this.findOneGroupMember({ member_uid, group_id });
    if (member) {
      return ResultMsg.fail('已加入过该群组');
    }
    const newData = {
      member_avatar: userRes.user_avatar,
      member_remark: member_remark ? member_remark : userRes.user_name,
      member_role: group.creator_uid === member_uid ? 'owner' : 'member',
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

  /* 查询群成员信息 */
  async findOneGroupMember(query: FindOneGroupMemberDto) {
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
      qb.andWhere('group_member.id = :id', { id });
    }
    if (group_id) {
      qb.andWhere('group_member.group_id = :group_id', { group_id });
    }
    if (member_uid) {
      qb.andWhere('group_member.member_uid = :member_uid', { member_uid });
    }
    if (member_role) {
      qb.andWhere('group_member.member_role = :member_role', { member_role });
    }
    if (member_remark) {
      qb.andWhere('group_member.member_remark = :member_remark', {
        member_remark,
      });
    }
    if (member_status) {
      qb.andWhere('group_member.member_status = :member_status', {
        member_status,
      });
    }
    const member = await qb.getOne();
    return member;
  }

  /* 查询用户加入的所有群组详情*/
  findAllJoinGroupDetail = async (query: FindJoinGroupDto) => {
    const { pageNum = 1, pageSize = 10, uid } = query || {};
    const qb = this.groupmemberRepository.createQueryBuilder('group_member');
    qb.where('group_member.member_uid = :uid', { uid });
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
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
        isPaging: false,
      });
    }
    return ResultList.list();
  };

  /* 修改群成员信息 */
  async updateGroupMember(data: UpdateGroupMemberDto) {
    const { id } = data || {};
    const updateRes = await this.groupmemberRepository
      .createQueryBuilder('group_member')
      .update()
      .set({ ...data })
      .where('group_member.id = :id', { id })
      .execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 删除单个群成员 */
  async removeGroupMember(id: number) {
    const delRes = await this.groupmemberRepository
      .createQueryBuilder('group_member')
      .delete()
      .where('group_member.id = :id', { id })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 删除一个群下的所有群成员 */
  async removeMoreGroupMember(gId: string) {
    const delRes = await this.groupmemberRepository
      .createQueryBuilder('group_member')
      .delete()
      .where('group_member.group_id = :gId', { gId })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }
}
