import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultMsg, ResultList } from 'src/commom/utils/result';
import { FindAllMusicDto, FindAllFavoritesDto } from './dto/findall-music.dto';
import { formatleftJoinData } from 'src/commom/utils/base';
import { AddMusicFavoritesDto } from './dto/add-music.dto';
import {
  EditMusicDto,
  EditFavoritesDto,
  EditDefaultFavoritesDto,
} from './dto/edit-music.dto';
import { musicEntity } from './entities/music.entity';
import { favoritesEntity } from './entities/favorites.entity';
import { Msg } from 'src/commom/constants/base-msg.const';
import { IdsDto } from 'src/commom/dto/commom.dto';
import { UserService } from 'src/modules/user/user.service';
import { FindOneFavoritesDto } from './dto/findone-favorites.dto';
import { BaseConst } from 'src/commom/constants/base.const';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(musicEntity)
    private readonly musicRepository: Repository<musicEntity>,
    @InjectRepository(favoritesEntity)
    private readonly favoritesRepository: Repository<favoritesEntity>,
    private readonly userService: UserService,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  /* 获取所有音乐 */
  async findAllMusic(query: FindAllMusicDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      ids,
      upload_uid,
      file_name,
      file_size,
      title,
      artist,
      album,
      isPaging = true,
      create_time,
    } = query || {};
    const qb = this.musicRepository.createQueryBuilder('music');
    if (ids) {
      qb.andWhere('music.id IN (:...ids)', { ids: ids });
    }
    if (upload_uid) {
      qb.andWhere('music.upload_uid = :uid', { uid: upload_uid });
    }
    if (file_name) {
      qb.andWhere('music.file_name LIKE :name', { name: `%${file_name}%` });
    }
    if (file_size) {
      qb.andWhere('music.file_size > :size', { size: file_size });
    }
    if (title) {
      qb.orWhere('music.title LIKE :title', { title: `%${title}%` });
    }
    if (artist) {
      qb.orWhere('music.artist LIKE :artist', { artist: `%${artist}%` });
      qb.orWhere('music.artists LIKE :artist', { artist: `%${artist}%` });
    }
    if (album) {
      qb.orWhere('music.album LIKE :album', { album: `%${album}%` });
    }
    if (create_time) {
      const time = new Date(create_time);
      qb.andWhere('music.create_time < :time', { time: time });
    }
    qb.orderBy('music.create_time', 'DESC');
    const count = await qb.getCount();

    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * (pageNum - 1));
    }
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /* 编辑音乐 */
  async updateMusic(data: EditMusicDto) {
    const { id } = data || {};
    const updateRes = await this.musicRepository
      .createQueryBuilder('music')
      .update()
      .set({ ...data })
      .where('music.id = :id', { id })
      .execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes.generatedMaps[0]);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 删除音乐 */
  async deleteMusic(data: IdsDto) {
    const { ids } = data || {};
    const delRes = await this.musicRepository
      .createQueryBuilder('music')
      .delete()
      .where('id IN (:...ids)', { ids: ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 添加音乐收藏 */
  async AddFavorites(data: AddMusicFavoritesDto) {
    const { creator_uid } = data || {};
    const existPost = await this.findOneFavorites({
      isFindMusic: false,
      ...data,
    });
    if (existPost) {
      return ResultMsg.fail(Msg.DATA_EXIST);
    }
    const user = await this.userService.findOneUser({ id: creator_uid });
    if (!user) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
    const favoritesForm = {
      ...data,
      creator_name: user.user_name,
      creator_avatar: user.user_avatar,
    };
    const favoritesData = this.favoritesRepository.create(favoritesForm);
    const insertRes = await this.favoritesRepository
      .createQueryBuilder('favorites')
      .insert()
      .into(favoritesEntity)
      .values([favoritesData])
      .execute();

    if (insertRes.identifiers.length) {
      return ResultMsg.ok(Msg.CREATE_SUCCESS, favoritesData);
    } else {
      return ResultMsg.fail(Msg.CREATE_FAIL);
    }
  }

  /* 修改音乐收藏 */
  async updateFavorites(data: EditFavoritesDto) {
    const { id, musicIds, handleType } = data || {};
    const existPost = await this.findOneFavorites({ id });
    if (!existPost) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
    if (musicIds) {
      const musicRes = await this.findAllMusic({
        ids: musicIds,
        isPaging: false,
      });
      if (handleType === 'add') {
        existPost.music.unshift(...musicRes.list);
      }
      if (handleType === 'remove') {
        existPost.music = existPost.music.filter(
          (item) => !musicIds.includes(item.id),
        );
      }
    }
    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_favoritesRepository =
        this.queryRunnerFactory.getRepository(favoritesEntity);
      // 数据库操作
      const updatePost = tx_favoritesRepository.merge(existPost, data);
      const saveRes = await tx_favoritesRepository.save(updatePost);

      if (saveRes) {
        await this.queryRunnerFactory.commitTransaction();
        return ResultMsg.ok(Msg.UPDATE_SUCCESS);
      } else {
        await this.queryRunnerFactory.rollbackTransaction();
        return ResultMsg.fail(Msg.UPDATE_FAIL);
      }
    } catch (error) {
      await this.queryRunnerFactory.rollbackTransaction();
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 默认收藏夹 */
  async updateDefaultFavorites(data: EditDefaultFavoritesDto) {
    const { creator_uid, musicIds, handleType } = data || {};
    const existPost = await this.favoritesRepository.findOne({
      where: {
        creator_uid,
        favorites_name: BaseConst.DefaultFavoritesName,
        is_default: '1',
      },
    });
    if (!existPost) {
      const user = await this.userService.findOneUser({ id: creator_uid });
      if (!user) {
        return ResultMsg.fail(Msg.DATA_NOEXIST);
      }
      const favoritesForm = {
        ...data,
        is_default: '1',
        favorites_name: BaseConst.DefaultFavoritesName,
        creator_name: user.user_name,
        creator_avatar: user.user_avatar,
      };
      const favoritesData = this.favoritesRepository.create(favoritesForm);
      const insertRes = await this.favoritesRepository.insert(favoritesData);
      if (insertRes.identifiers.length) {
        return this.updateFavorites({
          id: favoritesData.id,
          musicIds,
          handleType,
        });
      }
    } else {
      return this.updateFavorites({ id: existPost.id, musicIds, handleType });
    }
  }

  /* 获取音乐收藏列表 */
  async findAllFavorites(query: FindAllFavoritesDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      creator_uid,
      creator_name,
      favorites_name,
      is_public,
      is_default = '0',
    } = query || {};
    const qb = this.favoritesRepository.createQueryBuilder('favorites');
    qb.leftJoin('favorites.music', 'music');
    qb.addSelect('COUNT(music.id)', 'musicCount');
    qb.groupBy('favorites.id');
    if (creator_uid) {
      qb.andWhere('favorites.creator_uid = :uid', { uid: creator_uid });
    }
    if (is_public) {
      qb.andWhere('favorites.is_public = :isPublic', { isPublic: is_public });
    }
    if (creator_name) {
      qb.andWhere('favorites.creator_name LIKE :name', {
        name: `%${creator_name}%`,
      });
    }
    if (favorites_name) {
      qb.andWhere('favorites.favorites_name LIKE :name', {
        name: `%${favorites_name}%`,
      });
    }
    if (is_default) {
      qb.andWhere('favorites.is_default = :status', { status: is_default });
    }
    qb.orderBy('favorites.create_time', 'DESC');
    const count = await qb.getCount();
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
    const data = await qb.getRawMany();
    const formatData = data.map(
      (item) => formatleftJoinData(item, 'favorites_') as favoritesEntity,
    );
    return ResultList.list(formatData, count);
  }

  /* 收藏夹详情 */
  async findOneFavorites(query: FindOneFavoritesDto) {
    const {
      id,
      isFindMusic = true,
      creator_uid,
      favorites_name,
      is_default,
    } = query || {};
    const qb = this.favoritesRepository.createQueryBuilder('favorites');
    if (id) {
      qb.andWhere('favorites.id = :id', { id });
    }
    if (creator_uid) {
      qb.andWhere('favorites.creator_uid = :uid', { uid: creator_uid });
    }
    if (favorites_name) {
      qb.andWhere('favorites.favorites_name = :name', { name: favorites_name });
    }
    if (is_default) {
      qb.andWhere('favorites.is_default = :status', { status: is_default });
    }
    if (isFindMusic == true) {
      qb.leftJoinAndSelect('favorites.music', 'music');
    }
    const data = await qb.getOne();
    return data;
  }

  /* 删除音乐收藏 */
  async deleteFavorites(data: IdsDto) {
    const { ids } = data || {};
    const delRes = await this.favoritesRepository
      .createQueryBuilder('favorites')
      .delete()
      .where('id IN (:...ids)', { ids: ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }
}
