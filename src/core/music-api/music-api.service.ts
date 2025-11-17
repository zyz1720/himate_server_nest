import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { MusicExtraService } from 'src/modules/music-extra/music-extra.service';
import { ConfigService } from '@nestjs/config';
import { FindMusicUrlDto, SearchMusicApiDto } from './dto/find-music-api.to';
import { MusicEntity } from 'src/modules/music/entity/music.entity';
import { FileService } from 'src/modules/file/file.service';
import { CommonUtil } from 'src/common/utils/common.util';
import axios from 'axios';
import {
  FileEntity,
  FileTypeEnum,
  UseTypeEnum,
} from 'src/modules/file/entity/file.entity';
import { MusicExtraEntity } from 'src/modules/music-extra/entity/music-extra.entity';
import { FavoritesEntity } from 'src/modules/favorites/entity/favorites.entity';
import { MusicService } from 'src/modules/music/music.service';

@Injectable()
export class MusicApiService {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
    private readonly musicExtraService: MusicExtraService,
    private readonly fileService: FileService,
    private readonly musicService: MusicService,
  ) {}

  /* 获取第三方播放地址 */
  async findMusicUrl(query: FindMusicUrlDto) {
    const { id, quality = 9, type = 0, ekey = false } = query || {};
    try {
      const musicRes = await axios.post(
        this.configService.get('MUSIC_API') + '/geturl',
        { id, quality, type, ekey },
      );
      if (musicRes.status != 200) {
        return Response.fail(this.i18n.t('message.GET_FAIL'));
      }
      if (musicRes.data.code === 200) {
        const music = musicRes.data.data;
        return Response.ok(this.i18n.t('message.GET_SUCCESS'), music);
      } else {
        return Response.fail(musicRes.data.message);
      }
    } catch (error) {
      Logger.error(error);
      return Response.fail(this.i18n.t('message.GET_FAIL'));
    }
  }

  /* 第三方api获取搜索 */
  async findMusicList(query: SearchMusicApiDto) {
    const { word, current = 1, pageSize = 10 } = query || {};
    try {
      const searchRes = await axios.get(
        this.configService.get('MUSIC_API') + '/search/song',
        { params: { word, current, pageSize } },
      );
      if (searchRes.status != 200) {
        return Response.fail(this.i18n.t('message.GET_FAIL'));
      }
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
        return Response.ok(this.i18n.t('message.GET_SUCCESS'), list);
      } else {
        return Response.fail(searchRes.data.message);
      }
    } catch (error) {
      Logger.error(error);
      return Response.fail(this.i18n.t('message.GET_FAIL'));
    }
  }

  /* 第三方api获取歌词 */
  async findMusicLyric(id: string) {
    try {
      const lyricRes = await axios.get(
        this.configService.get('MUSIC_API') + '/lyric',
        { params: { id } },
      );
      if (lyricRes.status != 200) {
        return Response.fail(this.i18n.t('message.GET_FAIL'));
      }
      if (lyricRes.data.code === 200) {
        const lyric = lyricRes.data.data;
        return Response.ok(this.i18n.t('message.GET_SUCCESS'), lyric);
      } else {
        return Response.fail(lyricRes.data.message);
      }
    } catch (error) {
      Logger.error(error);
      return Response.fail(this.i18n.t('message.GET_FAIL'));
    }
  }

  /* 为本地音乐匹配更多信息 */
  async matchMusicInfo(num: number) {
    let count = 0;
    // 使用事务保证操作一致性
    const queryRunner =
      this.musicRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const musicList = await queryRunner.manager.find(MusicEntity, {
        where: { music_extra_id: IsNull() },
        take: num,
      });

      const matchPromises = musicList.map(async (element) => {
        await CommonUtil.delay();
        const findRes = await this.findMusicList({
          word: element.title,
          pageSize: 10,
        });
        if ('list' in findRes) {
          const newlist = findRes.list as any[];
          const matchedMusic = newlist.find(
            (item) =>
              item.title.includes(element.title) &&
              (item.artist.includes(element.artist) ||
                item.album.includes(element.album)),
          );
          if (matchedMusic) {
            await CommonUtil.delay();
            const downloadRes = (await this.fileService.downloadSaveFile({
              download_url: matchedMusic.cover,
              use_type: UseTypeEnum.music,
              file_type: FileTypeEnum.image,
            })) as Response<{ file_key: string }>;
            await CommonUtil.delay();
            const lyricRes = await this.findMusicLyric(matchedMusic.id);
            if (downloadRes.code === 0 && lyricRes.code === 0) {
              const { lrc, trans, yrc, roma } = lyricRes.data;
              const { id } = matchedMusic;
              const insertData = queryRunner.manager.create(MusicExtraEntity, {
                music_id: element.id,
                match_id: id,
                music_cover: downloadRes.data.file_key,
                music_lyric: lrc,
                music_trans: trans,
                music_yrc: yrc,
                music_roma: roma,
              });
              element.musicExtra = insertData;
              await queryRunner.manager.save(MusicExtraEntity, insertData);
              const saveRes = await queryRunner.manager.save(
                MusicEntity,
                element,
              );
              if (saveRes) {
                count += 1;
              }
            }
          }
        }
      });
      await Promise.all(matchPromises);
      await queryRunner.commitTransaction();
      return Response.ok(count + this.i18n.t('message.BATCH_UPDATE_SUCCESS'));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error('为本地音乐匹配更多信息失败:', error);
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    } finally {
      await queryRunner.release();
    }
  }

  /* 同步第三方收藏夹 */
  async syncMusicFavorites(uid: number, url: string) {
    try {
      const musicRes = await axios.get(url);

      const regex = /var firstPageData\s*=\s*({.*?})\s*;\s*(?:\n|$)/s;
      const match = musicRes.data.match(regex);

      if (match && match[1]) {
        // 使用事务保证操作一致性
        const queryRunner =
          this.musicRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          const parsedData = JSON.parse(match[1]);
          const { title, picurl, desc, id } = parsedData?.taogeData || {};
          if (!title || !picurl || !id) {
            return Response.fail(this.i18n.t('message.NO_PARSE_DATA'));
          }
          const favorites = await queryRunner.manager.findOne(FavoritesEntity, {
            where: { favorites_uid: uid },
          });
          if (favorites) {
            const { m_ids, m_count } = await this.batchDownloadMusic(id);
            if (m_ids.length == 0) {
              return Response.fail(
                this.i18n.t('message.DOWNLOAD_FAVORITES_FAILED'),
              );
            }
            const updateFavoritesRes = await this.updateFavorites({
              id: favorites.id,
              musicIds: m_ids,
              handleType: HandleType.Add,
            });
            if (updateFavoritesRes.success) {
              return ResultMsg.ok(
                `共${m_count}首音乐，成功导入${m_ids.length}首音乐`,
              );
            }
          } else {
            const addForm = {
              creator_uid: uid,
              favorites_name: title,
              favorites_remark: desc || '',
            } as favoritesEntity;
            const downloadRes = await this.fileService.downloadSaveFile(
              picurl as string,
              {
                uid: uid,
                use_type: FileUseType.Music,
                file_type: FileType.Image,
                isAddTimeStamp: NumericStatus.True,
              },
            );
            if (downloadRes.success) {
              addForm.favorites_cover = downloadRes.data?.file_name;
            }
            const addFavoritesRes = await this.addFavorites(addForm);
            if (!addFavoritesRes.success) {
              return ResultMsg.fail(Msg.CREATE_FAIL);
            }
            await delay();
            const { m_ids, m_count } = await this.batchDownloadMusic(id, uid);
            if (m_ids.length == 0) {
              return ResultMsg.fail('未能导入任何音乐');
            }
            const updateFavoritesRes = await this.updateFavorites({
              id: addFavoritesRes.data.id,
              musicIds: m_ids,
              handleType: HandleType.Add,
            });
            if (updateFavoritesRes.success) {
              return ResultMsg.ok(
                `共${m_count}首音乐，成功导入${m_ids.length}首音乐`,
              );
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
  async batchDownloadMusic(thirdPartyId: number) {
    const musicIds = [];
    let musicCount = 0;

    const factorieRes = await this.findMoreFavorite(thirdPartyId);
    if (factorieRes.code === 0) {
      try {
        const queryRunner =
          this.musicRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { songlist, songnum } = factorieRes.data;
        musicCount = songnum;
        const downloadPromises = songlist.map(async (item: any) => {
          const { id: mid, interval, title, singer, album } = item;
          const music = await queryRunner.manager.findOne(MusicEntity, {
            relations: ['music_extra'],
            where: { musicExtra: { match_id: String(mid) } },
          });
          if (music) {
            musicIds.push(music.id);
          } else {
            const findRes = await this.findMusicUrl({ id: mid });
            if (findRes.code === 0) {
              const { url, singer: _singer, quality } = findRes.data;
              if (!quality.includes('试听')) {
                await CommonUtil.delay();
                const downloadRes = await this.fileService.downloadSaveFile(
                  {
                    download_url: url,
                    use_type: UseTypeEnum.music,
                    file_type: FileTypeEnum.audio,
                  },
                  false,
                );
                if (downloadRes.code === 0) {
                  const { file_key } = downloadRes.data as FileEntity;
                  const createMusic = queryRunner.manager.create(MusicEntity, {
                    file_key: file_key,
                    sample_rate: 44100,
                    bitrate: 320000,
                    duration: interval,
                    title,
                    artist: _singer,
                    artists: singer.map((e: any) => e.title),
                    album: album.title,
                  });
                  await queryRunner.manager.save(createMusic);
                }
              }
            }
          }
        });

        await Promise.all(downloadPromises);
      } catch (error) {
        console.error('An error occurred in batchDownloadMusic', error);
      }
    }
    return {
      m_ids: musicIds,
      m_count: musicCount,
    };
  }

  /* 获取第三方歌单 */
  async findMoreFavorite(thirdPartyId: number) {
    try {
      const favoriteRes = await axios.get(
        this.configService.get('FAVORITE_API'),
        {
          params: { id: thirdPartyId, format: 'json', newsong: 1 },
        },
      );
      if (favoriteRes.status != 200) {
        return Response.fail(this.i18n.t('message.GET_FAIL'));
      }
      if (favoriteRes.data.code == 0) {
        const favorite = favoriteRes.data.data.cdlist[0];
        return Response.ok(this.i18n.t('message.GET_SUCCESS'), favorite);
      } else {
        return Response.fail(this.i18n.t('message.GET_FAIL'));
      }
    } catch (error) {
      console.log(error);
      return Response.fail(this.i18n.t('message.GET_FAIL'));
    }
  }

  /* 匹配音乐扩展信息 */
  async matchMusicExtra(id: number, mid: string) {
    const musicRes = await this.musicService.findOneMusic(id);
    if (musicRes.code !== 0) {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
    if (mid) {
      const musicUrlRes = await this.findMusicUrl({ id: mid });
      if (musicUrlRes.code !== 0) {
        return musicUrlRes;
      }
      const { cover, song, singer, album } = musicUrlRes.data;
      const musicLrcRes = await this.findMusicLyric(mid);
      if (musicLrcRes.code !== 0) {
        return musicLrcRes;
      }
      const downloadRes = await this.fileService.downloadSaveFile({
        download_url: cover,
        use_type: UseTypeEnum.music,
        file_type: FileTypeEnum.image,
      });
      if (downloadRes.code !== 0) {
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
      const music = musicRes.data as MusicEntity;
      if (music.musicExtra) {
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
  }
}
