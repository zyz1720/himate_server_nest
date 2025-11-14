import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicEntity } from './entity/music.entity';
import { AddMusicDto } from './dto/add-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { FindAllMusicDto } from './dto/find-all-music.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

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
    const count = await qb.getCount();
    const data = await qb.getMany();
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
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
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
}
