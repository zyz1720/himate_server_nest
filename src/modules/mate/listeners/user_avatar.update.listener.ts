import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AvatarUpdatedEvent } from 'src/modules/user/events/update-avatar.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mateEntity } from 'src/entities/mate.entity';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';
import { MateStatus } from 'src/commom/constants/base-enum.const';

@Injectable()
export class UserAvatarUpdatedListener {
  constructor(
    @InjectRepository(mateEntity)
    private readonly mateRepository: Repository<mateEntity>,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  /* 监听用户头像更改 */
  @OnEvent('avatar.updated')
  async handleAvatarUpdateEvent(payload: AvatarUpdatedEvent): Promise<boolean> {
    const { userId, newAvatar } = payload || {};
    const mateRes = await this.mateRepository
      .createQueryBuilder('mate')
      .where('mate.mate_status = :status', { status: MateStatus.Agreed })
      .andWhere('mate.agree_uid = :userId OR mate.apply_uid = :userId', {
        userId,
      })
      .getMany();

    if (!mateRes.length) {
      return true;
    }

    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_mateRepository =
        this.queryRunnerFactory.getRepository(mateEntity);

      const updatePromises = mateRes.map(async (element) => {
        if (element.agree_uid === userId) {
          await tx_mateRepository.update(element.id, {
            agree_avatar: newAvatar,
          });
        } else if (element.apply_uid === userId) {
          await tx_mateRepository.update(element.id, {
            apply_avatar: newAvatar,
          });
        }
      });

      await Promise.all(updatePromises);
      await this.queryRunnerFactory.commitTransaction();
      return true;
    } catch (error) {
      await this.queryRunnerFactory.rollbackTransaction();
      console.error('更新好友头像时发生错误:', error);
      return false;
    }
  }
}
