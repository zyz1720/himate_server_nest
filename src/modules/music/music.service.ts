import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultMsg, ResultList } from 'src/commom/utils/result';
import {
  FindAllMusicDto,
  FindAllFavoritesDto,
  FindMusicMoreDto,
  FindMusicUrlDto,
} from './dto/findall-music.dto';
import { formatleftJoinData, delay } from 'src/commom/utils/base';
import { AddMusicFavoritesDto, SyncFavoritesDto } from './dto/add-music.dto';
import {
  EditMusicDto,
  EditFavoritesDto,
  EditDefaultFavoritesDto,
  MatchMusicMoreDto,
} from './dto/edit-music.dto';
import { musicEntity } from 'src/entities/music.entity';
import { favoritesEntity } from 'src/entities/favorites.entity';
import { musicMoreEntity } from 'src/entities/music-more.entity';
import { Msg } from 'src/commom/constants/base-msg.const';
import { IdsDto } from 'src/commom/dto/commom.dto';
import { UserService } from 'src/modules/user/user.service';
import { FindOneFavoritesDto } from './dto/findone-favorites.dto';
import { BaseConst } from 'src/commom/constants/base.const';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';
import { ConfigService } from '@nestjs/config';
import { FileService } from '../file/file.service';
import axios from 'axios';
import {
  FileUseType,
  MessageType as FileType,
} from 'src/commom/constants/base-enum.const';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(musicEntity)
    private readonly musicRepository: Repository<musicEntity>,
    @InjectRepository(favoritesEntity)
    private readonly favoritesRepository: Repository<favoritesEntity>,
    @InjectRepository(musicMoreEntity)
    private readonly musicMoreRepository: Repository<musicMoreEntity>,
    private readonly userService: UserService,
    private readonly queryRunnerFactory: QueryRunnerFactory,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
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

  /* 获取音乐详情 */
  async findOneMusic(id: number) {
    const music = this.musicRepository
      .createQueryBuilder('music')
      .leftJoinAndSelect('music.musicMore', 'musicMore')
      .where('music.id = :id', { id })
      .getOne();
    return music;
  }

  /* 编辑音乐 */
  async updateMusic(data: EditMusicDto) {
    const { id, m_id, uid, reset_more = '0' } = data || {};
    const music = await this.findOneMusic(id);
    if (!music) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
    const updateData = this.musicRepository.merge(music, data);
    if (m_id) {
      const musicRes = await this.findMusicUrl({ id: m_id });
      if (!musicRes.success) {
        return musicRes;
      }
      const { cover, song, singer, album } = musicRes.data;
      const musicLrcRes = await this.findMusicLyric(m_id);
      if (!musicLrcRes.success) {
        return musicLrcRes;
      }
      const downloadRes = await this.fileService.downloadSaveFile(cover, {
        uid,
        use_type: FileUseType.Music,
        file_type: FileType.Image,
      });
      if (!downloadRes.success) {
        return downloadRes;
      }
      const { lrc, trans, yrc, roma } = musicLrcRes.data;
      const insertData = {
        music_id: id,
        match_id: String(m_id),
        music_name: song,
        music_singer: singer,
        music_album: album,
        music_cover: downloadRes.data?.file_name,
        music_lyric: lrc,
        music_trans: trans,
        music_yrc: yrc,
        music_roma: roma,
      };
      if (music.musicMore) {
        const musicMore = music.musicMore;
        const updateObj = this.musicMoreRepository.merge(musicMore, insertData);
        const updateRes = await this.musicMoreRepository.update(
          musicMore.id,
          updateObj,
        );
        if (!updateRes.affected) {
          return ResultMsg.fail(Msg.UPDATE_FAIL);
        }
      } else {
        const createRes = this.musicMoreRepository.create(insertData);
        updateData.musicMore = createRes;
      }
    }
    if (reset_more == '1') {
      updateData.musicMore = null;
    }
    const updateRes = await this.musicRepository.save(updateData);
    if (updateRes) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes);
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
      .where('id IN (:...ids)', { ids: [...ids] })
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
      .where('id IN (:...ids)', { ids: [...ids] })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 第三方api获取搜索 */
  async findMusicMoreList(query: FindMusicMoreDto) {
    const { word, page = 1, num = 5 } = query || {};
    try {
      const searchRes = await axios.get(
        this.configService.get('MUSIC_API') + '/search/song',
        { params: { word, page, num } },
      );
      // console.log(searchRes.data);
      if (searchRes.data.code === 200) {
        const list = searchRes.data.data.map((item: any) => {
          return {
            id: item.id,
            mid: item.mid,
            title: item.song,
            artist: item.singer,
            album: item.album,
            cover: item.cover,
          };
        });
        return ResultList.list(list, list.length);
      } else {
        return ResultMsg.fail(searchRes.data.message);
      }
    } catch (error) {
      console.log(error);
      return ResultMsg.fail(Msg.GET_FAIL);
    }
  }

  /* 第三方api获取歌词 */
  async findMusicLyric(id: number) {
    try {
      const lyricRes = await axios.get(
        this.configService.get('MUSIC_API') + '/lyric',
        { params: { id } },
      );
      if (lyricRes.data.code === 200) {
        const lyric = lyricRes.data.data;
        return ResultMsg.ok(Msg.GET_SUCCESS, lyric);
      } else {
        return ResultMsg.fail(lyricRes.data.message);
      }
    } catch (error) {
      console.log(error);
      return ResultMsg.fail(Msg.GET_FAIL);
    }
  }

  /* 获取第三方播放地址 */
  async findMusicUrl(query: FindMusicUrlDto) {
    const { id, quality = 9, type = 0, ekey = false } = query || {};
    try {
      const musicRes = await axios.post(
        this.configService.get('MUSIC_API') + '/geturl',
        { id, quality, type, ekey },
      );
      if (musicRes.data.code === 200) {
        const music = musicRes.data.data;
        return ResultMsg.ok(Msg.GET_SUCCESS, music);
      } else {
        return ResultMsg.fail(musicRes.data.message);
      }
    } catch (error) {
      console.log(error);
      return ResultMsg.fail(Msg.GET_FAIL);
    }
  }

  /* 为本地音乐匹配更多信息 */
  async matchMusicInfo(query: MatchMusicMoreDto) {
    const { uid, num = 10 } = query || {};
    let count = 0;
    const qb = this.musicRepository.createQueryBuilder('music');
    qb.select(['music.id', 'music.title', 'music.artist', 'music.album']);
    qb.leftJoinAndSelect('music.musicMore', 'musicMore');
    qb.where('musicMore.id IS NULL');
    if (num) {
      qb.limit(num);
    }
    const musicList = await qb.getMany();
    const matchPromises = musicList.map(async (element) => {
      await delay(1000);
      const findRes = await this.findMusicMoreList({
        word: element.title,
        num: 10,
      });
      if ('list' in findRes) {
        const newlist = findRes.list as any[];
        const matchedMusic = newlist.find(
          (item) =>
            item.title.includes(element.title) &&
            (item.artist === element.artist || item.album === element.album),
        );
        if (matchedMusic) {
          await delay(1000);
          const downloadRes = await this.fileService.downloadSaveFile(
            matchedMusic.cover,
            { uid, use_type: FileUseType.Music, file_type: FileType.Image },
          );
          await delay(1000);
          const lyricRes = await this.findMusicLyric(matchedMusic.id);
          if (downloadRes.success && lyricRes.success) {
            const { lrc, trans, yrc, roma } = lyricRes.data;
            const { id, title, artist, album } = matchedMusic;
            const insertData = this.musicMoreRepository.create({
              music_id: element.id,
              match_id: id,
              music_name: title,
              music_singer: artist,
              music_album: album,
              music_cover: downloadRes.data?.file_name,
              music_lyric: lrc,
              music_trans: trans,
              music_yrc: yrc,
              music_roma: roma,
            });
            element.musicMore = insertData;
            const saveRes = await this.musicRepository.save(element);
            if (saveRes) {
              count += 1;
              // console.log('更新音乐详情成功');
            }
          }
        }
      }
    });
    try {
      await Promise.all(matchPromises);
      return ResultMsg.ok(
        `共${musicList.length}条音乐，成功匹配${count}条音乐信息`,
      );
    } catch (error) {
      console.error(error);
      return ResultMsg.fail('匹配失败');
    }
  }

  /* 同步第三方收藏夹 */
  async syncMoreFavorites(data: SyncFavoritesDto) {
    const { url, creator_uid } = data || {};
    try {
      const musicRes = await axios.get(url);

      const regex = /var firstPageData\s*=\s*({.*?})\s*;\s*(?:\n|$)/s;
      const match = musicRes.data.match(regex);

      if (match && match[1]) {
        try {
          // return JSON.parse(match[1])?.taogeData;
          const parsedData = JSON.parse(match[1]);
          const { title, picurl, desc, songlist } = parsedData?.taogeData || {};
          if (!title || !picurl || !songlist) {
            return ResultMsg.fail('未解析到有效数据');
          }
          const existPost = await this.findOneFavorites({
            isFindMusic: false,
            favorites_name: title,
          });
          if (existPost) {
          } else {
            const addForm = {
              creator_uid,
              favorites_name: title,
              favorites_remark: desc || '',
            } as {
              creator_uid: number;
              favorites_name: string;
              favorites_remark: string;
              [key: string]: any;
            };
            const downloadRes = await this.fileService.downloadSaveFile(
              picurl as string,
              {
                uid: creator_uid,
                use_type: FileUseType.Music,
                file_type: FileType.Image,
              },
            );
            if (downloadRes.success) {
              addForm.favorites_cover = downloadRes.data?.file_name;
            }
            const addFavoritesRes = await this.AddFavorites(addForm);
            if (!addFavoritesRes.success) {
              return ResultMsg.fail(Msg.CREATE_FAIL);
            }
          }
        } catch (error) {
          console.error(error);
          return ResultMsg.fail('不支持的数据格式');
        }
      }
    } catch (error) {
      console.log(error);
      return ResultMsg.fail(Msg.GET_FAIL);
    }
  }

  /* 批量下载音乐 */
  async batchDownloadMusic(data: any[], uid: number) {
    const musicIds = [];
    const downloadPromises = data.map(async (item) => {
      const { id, name, singer, album } = item;
      const musicRes = await this.musicRepository.findOne({
        where: { title: name, artist: singer.name, album: album.name },
      });
      if (musicRes) {
        musicIds.push(musicRes.id);
      } else {
        const findRes = await this.findMusicUrl({ id });
        if (findRes.success) {
          const { url } = findRes.data;
          const downloadMusicRes = await this.fileService.downloadSaveFile(
            url,
            { uid, use_type: FileUseType.Music, file_type: FileType.Audio },
          );
        }
      }
    });
  }
}
