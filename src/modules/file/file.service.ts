import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entity/file.entity';
import { AddFileDto, DownloadFileDto } from './dto/add-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FindAllAppFileDto, FindAllFileDto } from './dto/find-all-file.dto';
import { PageResponse, Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { IdsDto } from 'src/common/dto/common.dto';
import { FileUtil } from 'src/common/utils/file.util';
import { FileTypeEnum, UseTypeEnum } from './entity/file.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MoveTypeEnum } from 'src/common/constants/system-enum.const';

@Injectable()
export class FileService {
  constructor(
    @InjectQueue('file_queue') private readonly fileQueue: Queue,
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

  /* 添加一个文件并解析 */
  async addFileAndParse(data: AddFileDto, filePath: string) {
    const { file_type, use_type } = data;
    const entityData = this.fileRepository.create(data);
    const insertRes = await this.fileRepository.insert(entityData);
    if (insertRes.identifiers.length) {
      if (file_type == FileTypeEnum.audio && use_type == UseTypeEnum.music) {
        this.fileQueue.add('parse_music_metadata', {
          ...entityData,
          file_path: filePath,
        });
      }
      if (file_type == FileTypeEnum.image) {
        this.fileQueue.add('create_thumbnail_image', {
          ...entityData,
          file_path: filePath,
        });
      }
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
    const [data, count] = await qb.getManyAndCount();
    return PageResponse.list(data, count);
  }

  /* 查询已删除文件列表 */
  async findAllRecycledFiles(query: FindAllFileDto) {
    const {
      current = 1,
      pageSize = 10,
      file_type,
      use_type,
      file_key,
    } = query || {};
    const qb = this.fileRepository
      .createQueryBuilder('file')
      .withDeleted()
      .andWhere('delete_time IS NOT NULL');
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

    const [data, count] = await qb.getManyAndCount();
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
      return Response.fail(this.i18n.t('message.DATA_NOT_EXIST'));
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
      this.batchMoveToRecycleBin([id]);
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复文件 */
  async restoreFile(id: number) {
    const result = await this.fileRepository.restore(id);
    if (result.affected) {
      this.batchRestoreFile([id]);
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除文件 */
  async deleteFile(id: number) {
    await this.batchForceDeleteFile([id]);
    const result = await this.fileRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 查询用户的文件列表 */
  async findAllAppFile(uid: number, query: FindAllAppFileDto) {
    const { use_type, current = 1, pageSize = 10 } = query || {};
    const qb = this.fileRepository
      .createQueryBuilder('file')
      .where('create_by = :uid', { uid })
      .andWhere('use_type = :use_type', {
        use_type: use_type,
      })
      .orderBy('create_time', 'DESC')
      .limit(pageSize)
      .offset(pageSize * (current - 1));
    const [data, count] = await qb.getManyAndCount();
    return PageResponse.list(data, count);
  }

  /* 批量删除用户的文件 */
  async batchSoftDeleteAppFile(uid: number, data: IdsDto) {
    const { ids } = data || {};
    const qb = this.fileRepository
      .createQueryBuilder('file')
      .softDelete()
      .where('create_by = :uid AND id IN (:...ids)', { uid, ids });
    const result = await qb.execute();
    if (result.affected) {
      this.batchMoveToRecycleBin(ids);
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 查询软删除的文件并移动到回收站 */
  async batchMoveToRecycleBin(ids: number[]) {
    const qb = this.fileRepository
      .createQueryBuilder('file')
      .where('id IN (:...ids) AND delete_time IS NOT NULL', { ids })
      .withDeleted();
    const softDeleteFiles = await qb.getMany();
    if (softDeleteFiles.length) {
      const waitFiles = softDeleteFiles.map((ele) => ({
        file_key: ele.file_key,
        move_type: MoveTypeEnum.Delete,
      }));
      this.fileQueue.add('move_file', waitFiles);
    }
  }

  /* 查询回收站文件并恢复 */
  async batchRestoreFile(ids: number[]) {
    const qb = this.fileRepository
      .createQueryBuilder('file')
      .where('id IN (:...ids) AND delete_time IS NULL', { ids });
    const restoreFiles = await qb.getMany();
    if (restoreFiles.length) {
      const waitFiles = restoreFiles.map((ele) => ({
        file_key: ele.file_key,
        move_type: MoveTypeEnum.Restore,
      }));
      this.fileQueue.add('move_file', waitFiles);
    }
  }

  /* 查询并批量强制删除本地文件 */
  async batchForceDeleteFile(ids: number[]) {
    const qb = this.fileRepository
      .createQueryBuilder('file')
      .where('id IN (:...ids)', { ids })
      .withDeleted();
    const softDeleteFiles = await qb.getMany();
    if (softDeleteFiles.length) {
      const waitFiles = softDeleteFiles.map((ele) => ({
        file_key: ele.file_key,
        is_recycle: ele.delete_time ? true : false,
        is_image: ele.file_type == FileTypeEnum.image,
      }));
      await this.fileQueue.add('force_delete_file', waitFiles);
    }
  }

  /* 下载文件并记录 */
  async downloadSaveFile(query: DownloadFileDto, isParse = true) {
    const { download_url, use_type, file_type } = query || {};
    const downloadRes = await FileUtil.downloadFile(download_url);
    if (downloadRes) {
      const { filePath, fileKey, originalName } = downloadRes;
      const fileSize = await FileUtil.getFileSize(filePath);
      const fileHash = await FileUtil.generateFileHash(filePath);
      const fileInfo = {
        file_key: fileKey,
        file_hash: fileHash,
        file_size: fileSize,
        use_type: use_type,
        file_type: file_type,
        original_file_name: originalName,
      } as AddFileDto;
      if (isParse) {
        return this.addFileAndParse(fileInfo, filePath);
      } else {
        return this.addFile(fileInfo);
      }
    } else {
      return Response.fail(this.i18n.t('message.DOWNLOAD_FAILED'));
    }
  }
}
