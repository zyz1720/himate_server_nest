import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritesEntity } from './entity/favorites.entity';
import { AddFavoritesDto } from './dto/add-favorites.dto';
import {
  UpdateFavoritesDto,
  UpdateUserFavoritesDto,
} from './dto/update-favorites.dto';
import {
  FindAllFavoritesDto,
  SearchFavoritesDto,
} from './dto/find-all-favorites.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { Whether } from 'src/common/constants/database-enum.const';
import { IdsDto } from 'src/common/dto/common.dto';
import { MusicService } from '../music/music.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoritesEntity)
    private readonly favoritesRepository: Repository<FavoritesEntity>,
    private readonly i18n: I18nService,
    private readonly musicService: MusicService,
  ) {}

  /* 添加一个音乐收藏夹 */
  async addFavorites(data: AddFavoritesDto) {
    const entityData = this.favoritesRepository.create(data);
    const insertRes = await this.favoritesRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有音乐收藏夹 */
  async findAllFavorites(query: FindAllFavoritesDto) {
    const {
      current = 1,
      pageSize = 10,
      favorites_uid,
      favorites_name,
      is_public,
      is_default,
    } = query || {};
    const qb = this.favoritesRepository.createQueryBuilder('favorites');
    if (favorites_uid) {
      qb.andWhere('favorites_uid = :favorites_uid', {
        favorites_uid: favorites_uid,
      });
    }
    if (favorites_name) {
      qb.andWhere('favorites_name LIKE :favorites_name', {
        favorites_name: '%' + favorites_name + '%',
      });
    }
    if (is_public) {
      qb.andWhere('is_public = :is_public', {
        is_public: is_public,
      });
    }
    if (is_default) {
      qb.andWhere('is_default = :is_default', {
        is_default: is_default,
      });
    }

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 查询指定音乐收藏夹 */
  async findOneFavorites(id: number) {
    const result = await this.favoritesRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
  }

  /* 修改音乐收藏夹信息 */
  async updateFavorites(id: number, data: UpdateFavoritesDto) {
    const result = await this.favoritesRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除音乐收藏夹 */
  async softDeleteFavorites(id: number) {
    const result = await this.favoritesRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复音乐收藏夹 */
  async restoreFavorites(id: number) {
    const result = await this.favoritesRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除音乐收藏夹 */
  async deleteFavorites(id: number) {
    const result = await this.favoritesRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 用户查询音乐收藏夹 */
  async findUserFavorites(uid: number, query: FindAllFavoritesDto) {
    const { current = 1, pageSize = 10 } = query || {};
    const qb = this.favoritesRepository.createQueryBuilder('favorites');
    qb.where('favorites_uid = :uid', { uid });
    qb.andWhere('is_default = :is_default', { is_default: Whether.N });
    qb.orderBy('create_time', 'DESC');
    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 用户搜索音乐收藏夹 */
  async searchFavorites(query: SearchFavoritesDto) {
    const { current = 1, pageSize = 10, keyword } = query || {};
    const qb = this.favoritesRepository.createQueryBuilder('favorites');
    qb.leftJoinAndSelect('favorites.user', 'user')
      .leftJoinAndSelect('favorites.music', 'music')
      .loadRelationCountAndMap('favorites.musicCount', 'favorites.music')
      .select([
        'favorites.id',
        'favorites.favorites_name',
        'favorites.favorites_cover',
        'user.id',
        'user.user_name',
        'user.user_avatar',
      ])
      .andWhere(
        '(favorites.is_public = :is_public AND favorites.is_default = :is_default)',
        {
          is_public: Whether.Y,
          is_default: Whether.N,
        },
      );
    if (keyword) {
      qb.andWhere(
        '(favorites.favorites_name LIKE :keyword OR user.user_name LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    qb.orderBy('favorites.create_time', 'DESC');
    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 查询用户收藏夹详情 */
  async findUserFavoritesDetail(uid: number, id: number) {
    const qb = this.favoritesRepository
      .createQueryBuilder('favorites')
      .leftJoinAndSelect('favorites.user', 'user')
      .select(['favorites', 'user.id', 'user.user_name', 'user.user_avatar'])
      .where('favorites.id = :id', { id })
      .andWhere(
        '(favorites.favorites_uid = :uid OR favorites.is_public = :isPublic)',
        {
          uid,
          isPublic: Whether.Y,
        },
      );
    const favorites = await qb.getOne();
    return favorites;
  }

  /* 查询默用户认收藏夹 */
  async findUserDefaultFavorites(uid: number) {
    const favorites = await this.favoritesRepository
      .createQueryBuilder('favorites')
      .where('favorites_uid = :uid AND is_default = :is_default', {
        uid,
        is_default: Whether.Y,
      })
      .getOne();

    return favorites;
  }

  /* 用户更新收藏夹音乐信息 */
  async updateUserFavorites(
    uid: number,
    id: number,
    data: UpdateUserFavoritesDto,
  ) {
    const qb = this.favoritesRepository
      .createQueryBuilder('favorites')
      .update(data)
      .where('id = :id AND favorites_uid = :uid', {
        id,
        uid,
      });
    const result = await qb.execute();
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 用户批量删除收藏夹 */
  async softDeleteUserFavoritesBatch(uid: number, data: IdsDto) {
    const { ids } = data || {};
    const qb = this.favoritesRepository
      .createQueryBuilder('favorites')
      .softDelete()
      .where('id IN (:...ids) AND favorites_uid = :uid', {
        ids,
        uid,
      });
    const result = await qb.execute();
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }
}
