import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GroupDeleteEvent } from 'src/modules/group/events/delete-group.event';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';
import { groupMemberEntity } from 'src/entities/group-member.entity';

@Injectable()
export class GroupDeletedListener {
  constructor(private readonly queryRunnerFactory: QueryRunnerFactory) {}
  /*  监听群删除事件 */
  @OnEvent('group.deleted')
  async handleGroupDeletedEvent(payload: GroupDeleteEvent): Promise<boolean> {
    const { ids } = payload || {};
    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_groupmemberRepository =
        this.queryRunnerFactory.getRepository(groupMemberEntity);
      // 数据库操作
      const delRes = await tx_groupmemberRepository
        .createQueryBuilder('group_member')
        .delete()
        .where('group_id IN (:...ids)', { ids })
        .andWhere('delete_time IS NULL')
        .execute();
      if (delRes.affected) {
        await this.queryRunnerFactory.commitTransaction();
        return true;
      } else {
        await this.queryRunnerFactory.rollbackTransaction();
        return false;
      }
    } catch (error) {
      await this.queryRunnerFactory.rollbackTransaction();
      console.log('删除群成员失败', error);
      return false;
    }
  }
}
