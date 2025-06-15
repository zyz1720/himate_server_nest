import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appPackageEntity } from 'src/entities/app-package.entity';
import { Repository } from 'typeorm';
import { AddAppPackageDto } from './dto/add-app-package.dto';
import { FindOneAppPackageDto } from './dto/findone-app-package.dto';
import { UpdateAppPackageDto } from './dto/update-app-package.dto';
import { FindAllDto, IdsDto } from 'src/commom/dto/commom.dto';
import { ResultList, ResultMsg } from 'src/commom/utils/result';
import { Msg } from 'src/commom/constants/base-msg.const';

@Injectable()
export class AppPackageService {
  constructor(
    @InjectRepository(appPackageEntity)
    private readonly appPackageRepository: Repository<appPackageEntity>,
  ) {}

  /* 添加一个应用包 */
  async addAppPackage(data: AddAppPackageDto) {
    const appPackageData = this.appPackageRepository.create(data);
    const insertRes = await this.appPackageRepository.insert(appPackageData);
    if (insertRes.identifiers.length) {
      return ResultMsg.ok(Msg.CREATE_SUCCESS, appPackageData);
    } else {
      return ResultMsg.fail(Msg.CREATE_FAIL);
    }
  }

  /* 查询所有应用包 */
  async findAllAppPackage(query: FindAllDto) {
    const { pageNum = 0, pageSize = 10, isPaging = 1, ids } = query || {};
    const qb = this.appPackageRepository.createQueryBuilder('app_package');
    if (ids) {
      qb.andWhere('id IN (:...ids)', { ids });
    }
    qb.orderBy('create_time');
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * pageNum);
    }
    const count = await qb.getCount();
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /*  查询指定应用包*/
  async findOneAppPackage(query: FindOneAppPackageDto) {
    const { id, app_description, app_name, app_version, app_fileName } =
      query || {};
    const qb = this.appPackageRepository.createQueryBuilder('app_package');
    if (id) {
      qb.andWhere('id = :id', { id });
    }
    if (app_name) {
      qb.andWhere('app_name = :name', {
        name: app_name,
      });
    }
    if (app_version) {
      qb.andWhere('app_version = :version', {
        version: app_version,
      });
    }
    if (app_description) {
      qb.andWhere('app_description LIKE :description', {
        description: `%${app_description}%`,
      });
    }
    if (app_fileName) {
      qb.andWhere('app_fileName LIKE :fileName', {
        fileName: `%${app_fileName}%`,
      });
    }
    qb.orderBy('create_time', 'DESC');
    qb.take(1);
    const appPackageData = await qb.getOne();
    return appPackageData;
  }

  /* 修改应用包 */
  async updateAppPackage(data: UpdateAppPackageDto) {
    const { id } = data || {};
    const updateRes = await this.appPackageRepository
      .createQueryBuilder('app_package')
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes.generatedMaps[0]);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 软删除应用包 */
  async softDeleteAppPackage(data: IdsDto) {
    const { ids } = data || {};
    const delRes = await this.appPackageRepository
      .createQueryBuilder('app_package')
      .softDelete()
      .where('id IN (:...ids)', { ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 恢复应用包 */
  async restoreAppPackage(data: IdsDto) {
    const { ids } = data || {};
    const delRes = await this.appPackageRepository
      .createQueryBuilder('app_package')
      .restore()
      .where('id IN (:...ids)', { ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_RESTORE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.RESTORE_FAIL);
    }
  }

  /* 真刪除应用包*/
  async deleteAppPackage(data: IdsDto) {
    const { ids } = data || {};
    const delRes = await this.appPackageRepository
      .createQueryBuilder('app_package')
      .delete()
      .where('id IN (:...ids)', { ids })
      .andWhere('delete_time IS NOT NULL')
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }
}
