import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AvatarUpdatedEvent } from 'src/modules/user/events/update-avatar.event';
import { UserNameUpdatedEvent } from 'src/modules/user/events/update-userName.event';
import { MusicService } from '../music.service';
import { favoritesEntity } from '../entities/favorites.entity';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

@Injectable()
export class UserInfoUpdatedListener {
  constructor(
    private readonly musicService: MusicService,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  /*  监听用户头像更改 */
  @OnEvent('avatar.updated')
  async handleAvatarUpdateEvent(payload: AvatarUpdatedEvent): Promise<boolean> {
    const { userId, newAvatar } = payload || {};
    const findRes = await this.musicService.findAllFavorites({
      creator_uid: userId,
    });

    const favorites = findRes.list;
    const updateIds = favorites.map((element) => element.id);
    if (!updateIds.length) {
      return true;
    }

    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_favoritesRepository =
        this.queryRunnerFactory.getRepository(favoritesEntity);
      // 数据库操作
      const updateRes = await tx_favoritesRepository
        .createQueryBuilder('favorites')
        .update()
        .set({ creator_avatar: newAvatar })
        .where('favorites.id IN (:...updateIds)', { updateIds })
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
      console.error('更新收藏夹头像时发生错误:', error);
      return false;
    }
  }

  /*  监听用户名更改 */
  @OnEvent('userName.updated')
  async handleUserNameUpdateEvent(
    payload: UserNameUpdatedEvent,
  ): Promise<boolean> {
    const { userId, newUserName } = payload || {};
    const findRes = await this.musicService.findAllFavorites({
      creator_uid: userId,
    });

    const favorites = findRes.list;
    const updateIds = favorites.map((element) => element.id);
    if (!updateIds.length) {
      return true;
    }

    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_favoritesRepository =
        this.queryRunnerFactory.getRepository(favoritesEntity);
      // 数据库操作
      const updateRes = await tx_favoritesRepository
        .createQueryBuilder('favorites')
        .update()
        .set({ creator_name: newUserName })
        .where('favorites.id IN (:...updateIds)', { updateIds })
        .execute();
      if (updateRes.affected) {
        await this.queryRunnerFactory.commitTransaction();
        return true;
      } else {
        await this.queryRunnerFactory.rollbackTransaction();
        return false;
      }
    } catch (error) {
      console.error('更新收藏夹用户名时发生错误:', error);
      await this.queryRunnerFactory.rollbackTransaction();
      return false;
    }
  }
}
