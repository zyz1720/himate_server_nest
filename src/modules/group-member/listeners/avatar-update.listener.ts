import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AvatarUpdatedEvent } from 'src/modules/user/events/update-avatar.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { groupMemberEntity } from 'src/entities/group-member.entity';
import { QueryRunnerFactory } from 'src/common/factories/query-runner.factory';

@Injectable()
export class AvatarUpdatedListener {
  constructor(
    @InjectRepository(groupMemberEntity)
    private readonly groupMemberRepository: Repository<groupMemberEntity>,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}
  /*  监听用户头像更改 */
  @OnEvent('avatar.updated')
  async handleAvatarUpdateEvent(payload: AvatarUpdatedEvent) {
    const { userId, newAvatar } = payload || {};
    const memberRes = await this.groupMemberRepository
      .createQueryBuilder('group_member')
      .where('group_member.member_uid = :userId', {
        userId,
      })
      .getMany();
    const updateIds = memberRes.map((element) => element.id);
    if (!updateIds.length) {
      return true;
    }

    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_groupMemberRepository =
        this.queryRunnerFactory.getRepository(groupMemberEntity);

      const updateRes = await tx_groupMemberRepository
        .createQueryBuilder('group_member')
        .update()
        .set({ member_avatar: newAvatar })
        .where('group_member.id IN (:...updateIds)', { updateIds })
        .execute();

      if (updateRes.affected) {
        await this.queryRunnerFactory.commitTransaction();
        return true;
      } else {
        await this.queryRunnerFactory.rollbackTransaction();
        return false;
      }
    } catch (error) {
      await this.queryRunnerFactory.rollbackTransaction();
      console.error('更新群成员头像时发生错误:', error);
      return false;
    }
  }
}
