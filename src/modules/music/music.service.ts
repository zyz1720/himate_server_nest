import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MusicEntity } from './entity/music.entity';
import { AddMusicDto } from './dto/add-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { FindAllMusicDto, SearchMusicDto } from './dto/find-all-music.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { AppendMusicDto } from './dto/operate-music.dto';
import { IdsDto } from 'src/common/dto/common.dto';
import { FavoritesEntity } from '../favorites/entity/favorites.entity';
import { Whether } from 'src/common/constants/database-enum.const';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    private readonly i18n: I18nService,
  ) {}

  /* 添加一个音乐 */
  async addMusic(data: AddMusicDto) {
    const entityData = this.musicRepository.create(data);
    const insertRes = await this.musicRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有音乐 */
  async findAllMusic(query: FindAllMusicDto) {
    const {
      current = 1,
      pageSize = 10,
      sample_rate,
      bitrate,
      duration,
      artists,
      file_key,
      title,
      artist,
      album,
    } = query || {};
    const qb = this.musicRepository.createQueryBuilder('music');
    if (sample_rate) {
      qb.andWhere('sample_rate = :sample_rate', {
        sample_rate: sample_rate,
      });
    }
    if (bitrate) {
      qb.andWhere('bitrate = :bitrate', {
        bitrate: bitrate,
      });
    }
    if (duration) {
      qb.andWhere('duration = :duration', {
        duration: duration,
      });
    }
    if (artists) {
      qb.andWhere('artists LIKE :artists', {
        artists: '%' + artists + '%',
      });
    }
    if (file_key) {
      qb.andWhere('file_key LIKE :file_key', {
        file_key: '%' + file_key + '%',
      });
    }
    if (title) {
      qb.andWhere('title LIKE :title', {
        title: '%' + title + '%',
      });
    }
    if (artist) {
      qb.andWhere('artist LIKE :artist', {
        artist: '%' + artist + '%',
      });
    }
    if (album) {
      qb.andWhere('album LIKE :album', {
        album: '%' + album + '%',
      });
    }

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const [data, count] = await qb.getManyAndCount();
    return PageResponse.list(data, count);
  }

  /* 查询指定音乐 */
  async findOneMusic(id: number) {
    const result = await this.musicRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
    }
  }

  /* 修改音乐信息 */
  async updateMusic(id: number, data: UpdateMusicDto) {
    const result = await this.musicRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除音乐 */
  async softDeleteMusic(id: number) {
    const result = await this.musicRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复音乐 */
  async restoreMusic(id: number) {
    const result = await this.musicRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除音乐 */
  async deleteMusic(id: number) {
    const result = await this.musicRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 查询指定音乐及其扩展信息 */
  async findOneMusicAndExtra(id: number) {
    const result = await this.musicRepository.findOne({
      where: { id },
      relations: ['musicExtra'],
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
    }
  }

  /* 保存音乐信息 */
  async saveMusic(music: MusicEntity) {
    const insertRes = await this.musicRepository.save(music);
    if (insertRes.id) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), insertRes);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询音乐是否收藏 */
  async isFavoriteMusic(uid: number, id: number) {
    const result = await this.musicRepository
      .createQueryBuilder('music')
      .leftJoin('music.favorites', 'favorites')
      .where(
        'favorites.favorites_uid = :favorites_uid AND favorites.is_default = :is_default AND music.id = :id',
        {
          favorites_uid: uid,
          is_default: Whether.Y,
          id: id,
        },
      )
      .getExists();

    return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
  }

  /* 查询默认收藏的音乐 */
  async findUserDefaultFavoritesMusic(uid: number, query: FindAllMusicDto) {
    const { current = 1, pageSize = 10 } = query || {};
    const qb = this.musicRepository
      .createQueryBuilder('music')
      .leftJoin('music.favorites', 'favorites')
      .where(
        'favorites.favorites_uid = :favorites_uid AND favorites.is_default = :is_default',
        {
          favorites_uid: uid,
          is_default: Whether.Y,
        },
      )
      .limit(pageSize)
      .offset(pageSize * (current - 1));
    const [list, total] = await qb.getManyAndCount();
    return PageResponse.list(list, total);
  }

  /* 查询收藏的音乐 */
  async findUserFavoritesMusic(
    uid: number,
    favoritesId: number,
    query: FindAllMusicDto,
  ) {
    const { current = 1, pageSize = 10 } = query || {};
    const qb = this.musicRepository
      .createQueryBuilder('music')
      .leftJoin('music.favorites', 'favorites')
      .where('favorites.id = :favoritesId', {
        favoritesId,
      })
      .andWhere(
        '(favorites.favorites_uid = :uid OR favorites.is_public = :isPublic)',
        {
          uid,
          isPublic: Whether.Y,
        },
      )
      .limit(pageSize)
      .offset(pageSize * (current - 1));
    const [list, total] = await qb.getManyAndCount();
    return PageResponse.list(list, total);
  }

  /* 用户搜索音乐 */
  async searchMusic(query: SearchMusicDto) {
    const { keyword, current = 1, pageSize = 10 } = query || {};
    const qb = this.musicRepository.createQueryBuilder('music');
    if (keyword) {
      qb.where('music.title LIKE :keyword', {
        keyword: '%' + keyword + '%',
      });
      qb.orWhere('music.artist LIKE :keyword', {
        keyword: '%' + keyword + '%',
      });
      qb.orWhere('music.album LIKE :keyword', {
        keyword: '%' + keyword + '%',
      });
    }
    qb.orderBy('music.create_time', 'DESC');
    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const [data, count] = await qb.getManyAndCount();
    return PageResponse.list(data, count);
  }

  /* 用户收藏音乐 */
  async favoritesMusic(uid: number, query: IdsDto) {
    const { ids } = query || {};
    // 使用事务保证操作一致性
    const queryRunner =
      this.musicRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let defaultFavorites = await queryRunner.manager.findOne(
        FavoritesEntity,
        {
          where: { is_default: Whether.Y, favorites_uid: uid },
          relations: ['music'],
          select: {
            music: {
              id: true,
            },
          },
        },
      );
      if (!defaultFavorites) {
        defaultFavorites = queryRunner.manager.create(FavoritesEntity, {
          is_default: Whether.Y,
          favorites_uid: uid,
          favorites_name: '我的收藏',
        });
        await queryRunner.manager.save(defaultFavorites);
      }

      const music = await queryRunner.manager.find(MusicEntity, {
        where: { id: In(ids) },
        select: ['id'],
      });
      if (music.length == 0) {
        return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
      }

      defaultFavorites.music = [...(defaultFavorites.music || []), ...music];

      await queryRunner.manager.save(FavoritesEntity, defaultFavorites);
      await queryRunner.commitTransaction();
      return Response.ok(this.i18n.t('message.UPDATE_SUCCESS'));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('收藏音乐失败:', error);
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    } finally {
      await queryRunner.release();
    }
  }

  /*  用户取消收藏音乐 */
  async dislikeMusic(uid: number, query: IdsDto) {
    const { ids } = query || {};
    // 使用事务保证操作一致性
    const queryRunner =
      this.musicRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const defaultFavorites = await queryRunner.manager.findOne(
        FavoritesEntity,
        {
          where: { is_default: Whether.Y, favorites_uid: uid },
          relations: ['music'],
          select: {
            music: {
              id: true,
            },
          },
        },
      );
      if (!defaultFavorites) {
        return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
      }

      const music = await queryRunner.manager.find(MusicEntity, {
        where: { id: In(ids) },
        select: ['id'],
      });
      if (music.length == 0) {
        return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
      }

      defaultFavorites.music = defaultFavorites.music.filter(
        (item) => !ids.includes(item.id),
      );

      await queryRunner.manager.save(FavoritesEntity, defaultFavorites);
      await queryRunner.commitTransaction();
      return Response.ok(this.i18n.t('message.UPDATE_SUCCESS'));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('取消收藏音乐失败:', error);
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    } finally {
      await queryRunner.release();
    }
  }

  /* 用户移除收藏夹音乐 */
  async removeFavoritesMusic(uid: number, favoritesId: number, query: IdsDto) {
    const { ids } = query || {};
    // 使用事务保证操作一致性
    const queryRunner =
      this.musicRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const favorites = await queryRunner.manager.findOne(FavoritesEntity, {
        where: { favorites_uid: uid, id: favoritesId },
        relations: ['music'],
        select: {
          music: {
            id: true,
          },
        },
      });
      if (!favorites) {
        return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
      }

      favorites.music = favorites.music.filter(
        (item) => !ids.includes(item.id),
      );

      await queryRunner.manager.save(FavoritesEntity, favorites);
      await queryRunner.commitTransaction();
      return Response.ok(this.i18n.t('message.UPDATE_SUCCESS'));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('移除收藏夹音乐失败:', error);
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    } finally {
      await queryRunner.release();
    }
  }

  /* 用户添加音乐到收藏夹 */
  async appendFavoritesMusic(uid: number, query: AppendMusicDto) {
    const { favoritesIds, ids } = query || {};
    // 使用事务保证操作一致性
    const queryRunner =
      this.musicRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const favorites = await queryRunner.manager.find(FavoritesEntity, {
        where: {
          favorites_uid: uid,
          id: In(favoritesIds),
        },
        relations: ['music'],
        select: {
          music: {
            id: true,
          },
        },
      });
      if (favorites.length == 0) {
        return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
      }

      const music = await queryRunner.manager.find(MusicEntity, {
        where: { id: In(ids) },
        select: ['id'],
      });
      if (music.length == 0) {
        return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
      }

      favorites.forEach((item) => {
        item.music = [...item.music, ...music];
      });

      await queryRunner.manager.save(FavoritesEntity, favorites);
      await queryRunner.commitTransaction();
      return Response.ok(this.i18n.t('message.UPDATE_SUCCESS'));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('添加收藏夹音乐失败:', error);
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    } finally {
      await queryRunner.release();
    }
  }

  /* 查询音乐所有信息 */
  async findOneMusicDetails(id: number) {
    const music = await this.musicRepository.findOne({
      where: { id },
      relations: ['musicExtra'],
    });
    return music;
  }
}
