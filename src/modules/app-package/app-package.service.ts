import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppPackageEntity } from './entity/app-package.entity';
import { AddAppPackageDto } from './dto/add-app-package.dto';
import { UpdateAppPackageDto } from './dto/update-app-package.dto';
import {
  AppFindAllAppPackageDto,
  FindAllAppPackageDto,
} from './dto/find-all-app-package.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AppPackageService {
  constructor(
    @InjectRepository(AppPackageEntity)
    private readonly appPackageRepository: Repository<AppPackageEntity>,
    private readonly i18n: I18nService,
  ) {}

  /* 添加一个App版本 */
  async addAppPackage(data: AddAppPackageDto) {
    const entityData = this.appPackageRepository.create(data);
    const insertRes = await this.appPackageRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有App版本 */
  async findAllAppPackage(query: FindAllAppPackageDto) {
    const { current = 1, pageSize = 10, app_name } = query || {};
    const qb = this.appPackageRepository.createQueryBuilder('app_package');
    if (app_name) {
      qb.andWhere('app_name LIKE :app_name', {
        app_name: '%' + app_name + '%',
      });
    }

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    qb.orderBy('create_time', 'DESC');
    const [data, count] = await qb.getManyAndCount();
    return PageResponse.list(data, count);
  }

  /* 查询指定App版本 */
  async findOneAppPackage(id: number) {
    const result = await this.appPackageRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
    }
  }

  /* 修改App版本信息 */
  async updateAppPackage(id: number, data: UpdateAppPackageDto) {
    const result = await this.appPackageRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除App版本 */
  async softDeleteAppPackage(id: number) {
    const result = await this.appPackageRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复App版本 */
  async restoreAppPackage(id: number) {
    const result = await this.appPackageRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除App版本 */
  async deleteAppPackage(id: number) {
    const result = await this.appPackageRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 查询指定App的所有版本 */
  async findLatestAllAppPackage(data: AppFindAllAppPackageDto) {
    const { app_name, current = 1, pageSize = 10 } = data || {};
    const qb = this.appPackageRepository
      .createQueryBuilder('app_package')
      .leftJoin('app_package.file', 'file')
      .where('app_name = :app_name', { app_name })
      .select([
        'app_package',
        'file.id',
        'file.file_hash',
        'file.file_size',
        'file.file_key',
      ])
      .orderBy('app_package.create_time', 'DESC')
      .limit(pageSize)
      .offset(pageSize * (current - 1));
    const [list, count] = await qb.getManyAndCount();

    return PageResponse.list(list, count);
  }

  /* 查询指定App的最新版本 */
  async findLatestAppPackage(app_name: string) {
    const result = await this.appPackageRepository
      .createQueryBuilder('app_package')
      .leftJoin('app_package.file', 'file')
      .where('app_name = :app_name', { app_name })
      .select([
        'app_package',
        'file.id',
        'file.file_hash',
        'file.file_size',
        'file.file_key',
      ])
      .orderBy('app_package.create_time', 'DESC')
      .getOne();
    return result;
  }
}
