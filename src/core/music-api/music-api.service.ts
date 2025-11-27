import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Response } from 'src/common/response/api-response';
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
import { MatchMusicApiDto } from './dto/operate-music-api.dto';

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
        return Response.fail(this.i18n.t('message.GET_FAILED'));
      }
      if (musicRes.data.code == 200) {
        const music = musicRes.data.data;
        return Response.ok(this.i18n.t('message.GET_SUCCESS'), music);
      } else {
        return Response.fail(musicRes.data.message);
      }
    } catch (error) {
      Logger.error(error);
      return Response.fail(this.i18n.t('message.GET_FAILED'));
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
        return Response.fail(this.i18n.t('message.GET_FAILED'));
      }
      if (searchRes.data.code == 200) {
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
      return Response.fail(this.i18n.t('message.GET_FAILED'));
    }
  }

  /* 第三方api获取歌词 */
  async findMusicLyric(mid: string) {
    try {
      const lyricRes = await axios.get(
        this.configService.get('MUSIC_API') + '/lyric',
        { params: { id: mid } },
      );
      if (lyricRes.status != 200) {
        return Response.fail(this.i18n.t('message.GET_FAILED'));
      }
      if (lyricRes.data.code == 200) {
        const lyric = lyricRes.data.data;
        return Response.ok(this.i18n.t('message.GET_SUCCESS'), lyric);
      } else {
        return Response.fail(lyricRes.data.message);
      }
    } catch (error) {
      Logger.error(error);
      return Response.fail(this.i18n.t('message.GET_FAILED'));
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
        if ('data' in findRes) {
          const newList = findRes.data as any[];
          const matchedMusic = newList.find(
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
            if (downloadRes.code == 0 && lyricRes.code == 0) {
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
            relations: ['music'],
            select: {
              music: {
                id: true,
              },
            },
          });
          if (favorites) {
            const { musicIds, musicCount } = await this.batchDownloadMusic(id);
            if (musicIds.length == 0) {
              return Response.fail(
                this.i18n.t('message.DOWNLOAD_FAVORITES_FAILED'),
              );
            }
            favorites.music.unshift(...musicIds);
            await queryRunner.manager.save(FavoritesEntity, favorites);
            return Response.ok(
              `共${musicCount}首音乐，成功导入${musicIds.length}首音乐`,
            );
          } else {
            const addForm = {
              favorites_uid: uid,
              favorites_name: title,
              favorites_remarks: desc || '',
            } as FavoritesEntity;
            const downloadRes = (await this.fileService.downloadSaveFile({
              download_url: picurl,
              use_type: UseTypeEnum.music,
              file_type: FileTypeEnum.image,
            })) as Response<FileEntity>;
            if (downloadRes.code == 0) {
              addForm.favorites_cover = downloadRes.data?.file_key;
            }
            const addFavoritesRes = queryRunner.manager.create(
              FavoritesEntity,
              addForm,
            );
            await CommonUtil.delay();
            const { musicIds, musicCount } = await this.batchDownloadMusic(id);
            if (musicIds.length == 0) {
              return Response.fail(
                this.i18n.t('message.DOWNLOAD_FAVORITES_FAILED'),
              );
            }
            addFavoritesRes.music = musicIds;
            await queryRunner.manager.save(FavoritesEntity, addFavoritesRes);
            return Response.ok(
              `共${musicCount}首音乐，成功导入${musicIds.length}首音乐`,
            );
          }
        } catch (error) {
          console.error(error);
          return Response.fail(this.i18n.t('message.UNSUPPORTED_DATA_FORMAT'));
        }
      }
    } catch (error) {
      console.log(error);
      return Response.fail(this.i18n.t('message.GET_FAVORITES_FAILED'));
    }
  }

  /* 批量下载音乐 */
  async batchDownloadMusic(thirdPartyId: number) {
    const musicIds = [];
    let musicCount = 0;

    const favoriteRes = await this.findMoreFavorite(thirdPartyId);
    if (favoriteRes.code == 0) {
      const queryRunner =
        this.musicRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const { songlist, songnum } = favoriteRes.data;
        musicCount = songnum;
        const downloadPromises = songlist.map(async (item: any) => {
          const { id: mid, interval, title, singer, album } = item;
          const music = await queryRunner.manager.findOne(MusicEntity, {
            relations: ['musicExtra'],
            where: { musicExtra: { match_id: String(mid) } },
          });
          if (music) {
            musicIds.push(music.id);
          } else {
            const findRes = await this.findMusicUrl({ id: mid });
            if (findRes.code == 0) {
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
                if (downloadRes.code == 0) {
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
                  musicIds.push(createMusic.id);
                  await CommonUtil.delay();
                  await this.matchMusicExtra({
                    musicId: createMusic.id,
                    matchId: String(mid),
                  });
                }
              }
            }
          }
        });

        await Promise.all(downloadPromises);
        await queryRunner.commitTransaction();
      } catch (error) {
        Logger.error('批量下载音乐时发生错误', error);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
    return {
      musicIds,
      musicCount,
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
        return Response.fail(this.i18n.t('message.GET_FAILED'));
      }
      if (favoriteRes.data.code == 0) {
        const favorite = favoriteRes.data.data.cdlist[0];
        return Response.ok(this.i18n.t('message.GET_SUCCESS'), favorite);
      } else {
        return Response.fail(this.i18n.t('message.GET_FAILED'));
      }
    } catch (error) {
      Logger.error('获取第三方歌单时发生错误', error);
      return Response.fail(this.i18n.t('message.GET_FAILED'));
    }
  }

  /* 匹配音乐扩展信息 */
  async matchMusicExtra(data: MatchMusicApiDto) {
    const { musicId: id, matchId: mid } = data;
    const musicRes = await this.musicService.findOneMusicAndExtra(id);
    if (musicRes.code !== 0) {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
    if (mid) {
      const musicUrlRes = await this.findMusicUrl({ id: mid });
      if (musicUrlRes.code !== 0) {
        return musicUrlRes;
      }
      const { cover } = musicUrlRes.data;
      const musicLrcRes = await this.findMusicLyric(mid);
      if (musicLrcRes.code !== 0) {
        return musicLrcRes;
      }
      const downloadRes = (await this.fileService.downloadSaveFile({
        download_url: cover,
        use_type: UseTypeEnum.music,
        file_type: FileTypeEnum.image,
      })) as Response<FileEntity>;
      if (downloadRes.code !== 0) {
        return downloadRes;
      }
      const { lrc, trans, yrc, roma } = musicLrcRes.data;
      const insertData = {
        music_id: id,
        match_id: String(mid),
        music_cover: downloadRes.data?.file_key,
        music_lyric: lrc,
        music_trans: trans,
        music_yrc: yrc,
        music_roma: roma,
      };
      const music = musicRes.data as MusicEntity;
      if (music.musicExtra) {
        const musicExtra = music.musicExtra;
        const updateRes = await this.musicExtraService.updateMusicExtraByData(
          musicExtra,
          insertData,
        );
        return updateRes;
      } else {
        const createRes = (await this.musicExtraService.addMusicExtra(
          insertData,
        )) as Response<MusicExtraEntity>;
        if (createRes.code !== 0) {
          return createRes;
        }
        music.musicExtra = createRes.data;
        const saveRes = await this.musicService.saveMusic(music);
        return saveRes;
      }
    }
  }
}
