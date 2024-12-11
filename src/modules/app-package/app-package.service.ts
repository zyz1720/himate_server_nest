import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appPackageEntity } from 'src/entities/app-package.entity';
import { Repository } from 'typeorm';
import { AddAppPackageDto } from './dto/add-app-package.dto';
import { FindOneAppPackageDto } from './dto/findone-app-package.dto';
import { UpdateAppPackageDto } from './dto/update-app-package.dto';
import { FindAllDto } from 'src/commom/dto/commom.dto';
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
    const { pageNum = 1, pageSize = 10 } = query || {};
    const qb = this.appPackageRepository.createQueryBuilder('app_package');
    qb.orderBy('app_package.create_time');
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
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
      qb.where('app_package.id = :id', { id });
    }
    if (app_name) {
      qb.where('app_package.app_name = :name', {
        name: app_name,
      });
    }
    if (app_version) {
      qb.where('app_package.app_version LIKE :version', {
        version: `%${app_version}%`,
      });
    }
    if (app_description) {
      qb.where('app_package.app_description LIKE :description', {
        description: `%${app_description}%`,
      });
    }
    if (app_fileName) {
      qb.where('app_package.app_fileName LIKE :fileName', {
        fileName: `%${app_fileName}%`,
      });
    }
    const appPackageData = await qb.getOne();
    return appPackageData;
  }

  /* 修改应用包 */
  async updateAppPackage(data: UpdateAppPackageDto) {
    const { id } = data || {};
    delete data.id;
    const updateRes = await this.appPackageRepository
      .createQueryBuilder('app_package')
      .update()
      .set({ ...data })
      .where('app_package.id = :id', { id })
      .execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes.generatedMaps[0]);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 删除应用包 */
  async removeAppPackage(id: number) {
    const delRes = await this.appPackageRepository
      .createQueryBuilder('app_package')
      .delete()
      .where('app_package.id = :id', { id })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }
}
