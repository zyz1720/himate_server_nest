import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entity/file.entity';
import { AddFileDto } from './dto/add-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FindAllFileDto } from './dto/find-all-file.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly i18n: I18nService,
  ) {}

  /* 添加一个文件 */
  async addFile(data: AddFileDto) {
    const entityData = this.fileRepository.create(data);
    const insertRes = await this.fileRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      return Response.ok(this.i18n.t('message.CREATE_SUCCESS'), entityData);
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 查询所有文件 */
  async findAllFile(query: FindAllFileDto) {
    const {
      current = 1,
      pageSize = 10,
      file_type,
      use_type,
      file_key,
    } = query || {};
    const qb = this.fileRepository.createQueryBuilder('file');
    if (file_type) {
      qb.andWhere('file_type = :file_type', {
        file_type: file_type,
      });
    }
    if (use_type) {
      qb.andWhere('use_type = :use_type', {
        use_type: use_type,
      });
    }
    if (file_key) {
      qb.andWhere('file_key LIKE :file_key', {
        file_key: '%' + file_key + '%',
      });
    }

    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const count = await qb.getCount();
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 查询指定文件 */
  async findOneFile(id: number) {
    const result = await this.fileRepository.findOne({
      where: { id },
    });
    if (result) {
      return Response.ok(this.i18n.t('message.GET_SUCCESS'), result);
    } else {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
  }

  /* 修改文件信息 */
  async updateFile(id: number, data: UpdateFileDto) {
    const result = await this.fileRepository.update(id, data);
    if (result.affected) {
      return Response.ok(
        this.i18n.t('message.UPDATE_SUCCESS'),
        result.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 软删除文件 */
  async softDeleteFile(id: number) {
    const result = await this.fileRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复文件 */
  async restoreFile(id: number) {
    const result = await this.fileRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除文件 */
  async deleteFile(id: number) {
    const result = await this.fileRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }
}
