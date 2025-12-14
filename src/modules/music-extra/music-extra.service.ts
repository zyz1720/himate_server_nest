import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicExtraEntity } from './entity/music-extra.entity';
import { AddMusicExtraDto } from './dto/add-music-extra.dto';
import { UpdateMusicExtraDto } from './dto/update-music-extra.dto';
import { FindAllMusicExtraDto } from './dto/find-all-music-extra.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MusicExtraService {
  constructor(
    @InjectRepository(MusicExtraEntity)
    private readonly musicExtraRepository: Repository<MusicExtraEntity>,
    private readonly i18n: I18nService,
  ) {}

  /* 添加一个音乐扩展 */
  async addMusicExtra(data: AddMusicExtraDto) {
    const entityData = this.musicExtraRepository.create(data);
    const insertRes = await this.musicExtraRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有音乐扩展 */
  async findAllMusicExtra(query: FindAllMusicExtraDto) {
    const { current = 1, pageSize = 10, music_id, match_id } = query || {};
    const qb = this.musicExtraRepository.createQueryBuilder('music_extra');
    if (music_id) {
      qb.andWhere('music_id = :music_id', {
        music_id: music_id,
      });
    }
    if (match_id) {
      qb.andWhere('match_id LIKE :match_id', {
        match_id: '%' + match_id + '%',
      });
    }

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const [data, count] = await qb.getManyAndCount();
    return PageResponse.list(data, count);
  }

  /* 查询指定音乐扩展 */
  async findOneMusicExtra(id: number) {
    const result = await this.musicExtraRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
    }
  }

  /* 修改音乐扩展信息 */
  async updateMusicExtra(id: number, data: UpdateMusicExtraDto) {
    const result = await this.musicExtraRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除音乐扩展 */
  async softDeleteMusicExtra(id: number) {
    const result = await this.musicExtraRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复音乐扩展 */
  async restoreMusicExtra(id: number) {
    const result = await this.musicExtraRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除音乐扩展 */
  async deleteMusicExtra(id: number) {
    const result = await this.musicExtraRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 通过新数据修改音乐扩展信息 */
  async updateMusicExtraByData(
    oldData: MusicExtraEntity,
    newData: UpdateMusicExtraDto,
  ) {
    const updateObj = this.musicExtraRepository.merge(oldData, newData);
    const result = await this.musicExtraRepository.update(
      oldData.id,
      updateObj,
    );
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }
}
