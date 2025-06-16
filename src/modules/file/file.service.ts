import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fileEntity } from 'src/entities/file.entity';
import { ResultMsg } from 'src/commom/utils/result';
import { FindAllFileDto } from './dto/findall-file.dto';
import { ResultList } from 'src/commom/utils/result';
import { AddFileDto } from './dto/add-file.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { BaseConst } from 'src/commom/constants/base.const';
import { Msg } from 'src/commom/constants/base-msg.const';
import { BinaryLike } from 'crypto';
import { getFileNameFromUrl } from 'src/commom/utils/base';
import {
  FileUseType,
  MessageType as FileType,
  NumericStatus,
} from 'src/commom/constants/base-enum.const';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import axios from 'axios';
import { IdsDto } from 'src/commom/dto/commom.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectQueue('fileHandle') private readonly fileHandleQueue: Queue,
    @InjectRepository(fileEntity)
    private readonly fileRepository: Repository<fileEntity>,
  ) {}

  // 下载文件并记录
  async downloadSaveFile(url: string, query: AddFileDto) {
    const { isAddTimeStamp = NumericStatus.False } = query || {};
    const downloadRes = await this.downloadFile(
      url,
      BaseConst.uploadDir,
      isAddTimeStamp,
    );
    if (downloadRes) {
      const { filePath, fileName } = downloadRes;
      const addRes = await this.addFile(filePath, fileName, query);
      return addRes;
    } else {
      return ResultMsg.fail(Msg.DOWNLOAD_FAIL);
    }
  }

  // 添加文件到数据库
  async addFile(filePath: string, fileName: string, query: AddFileDto) {
    const {
      uid,
      file_type,
      use_type,
      isParser = NumericStatus.True,
    } = query || {};
    const fileHash = await this.generateFileHash(filePath);
    if (!fileHash) {
      return ResultMsg.fail('读取文件失败！');
    }
    const existFile = await this.fileRepository.findOne({
      where: { file_name: fileName },
    });
    if (existFile) {
      return ResultMsg.ok('已存在同名文件', existFile);
    }
    const fileSize = await this.getFileInfo(filePath);
    const fileForm = {
      file_name: fileName,
      upload_uid: uid,
      file_size: fileSize,
      file_type: file_type,
      use_type: use_type,
      file_path: filePath,
      file_hash: fileHash,
    };
    const fileData = this.fileRepository.create(fileForm);
    const insertRes = await this.fileRepository
      .createQueryBuilder('file')
      .insert()
      .into(fileEntity)
      .values([fileData])
      .execute();

    if (insertRes.identifiers.length) {
      if (isParser) {
        if (file_type === FileType.Audio && use_type === FileUseType.Music) {
          this.fileHandleQueue.add('addMusic', fileForm);
          return ResultMsg.ok(Msg.CREATE_SUCCESS, fileData);
        }
        if (file_type === FileType.Image) {
          this.fileHandleQueue.add('createThumbnail', fileForm);
          return ResultMsg.ok(Msg.CREATE_SUCCESS, fileData);
        }
      }
      return ResultMsg.ok(Msg.CREATE_SUCCESS, fileData);
    } else {
      return ResultMsg.fail(Msg.CREATE_FAIL);
    }
  }

  /* 获取文件列表 */
  async findAllFile(query: FindAllFileDto, uid?: number) {
    const {
      pageNum = 0,
      pageSize = 10,
      ids,
      upload_uid,
      file_name,
      file_size,
      file_type,
      use_type,
      file_hash,
      create_time,
      isPaging = NumericStatus.True,
    } = query || {};
    const qb = this.fileRepository.createQueryBuilder('file');
    if (ids) {
      qb.andWhere('id IN (:...ids)', { ids: ids });
    }
    if (upload_uid) {
      qb.andWhere('upload_uid = :uid', { uid: upload_uid });
    }
    if (file_name) {
      qb.andWhere('file_name LIKE :name', { name: `%${file_name}%` });
    }
    if (file_size) {
      qb.andWhere('file_size > :size', { size: file_size });
    }
    if (file_type) {
      qb.andWhere('file_type = :type', { type: file_type });
    }
    if (use_type) {
      qb.andWhere('use_type = :useType', { useType: use_type });
    }
    if (file_hash) {
      qb.andWhere('file_hash = :fileHash', { fileHash: file_hash });
    }
    if (create_time) {
      const time = new Date(create_time);
      qb.andWhere('create_time < :time', { time: time });
    }
    if (uid) {
      qb.andWhere('upload_uid = :uid', { uid });
    }
    qb.orderBy('create_time', 'DESC');
    const count = await qb.getCount();
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * pageNum);
    }
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /* 软删除文件 */
  async softDeleteFile(data: IdsDto, uid?: number) {
    const { ids } = data || {};
    const qb = this.fileRepository.createQueryBuilder('file').softDelete();
    qb.where('id IN (:...ids)', { ids });
    if (uid) {
      qb.andWhere('upload_uid = :uid', { uid });
    }
    const delRes = await qb.execute();
    if (delRes.affected) {
      // 移入回收站
      const qb = this.fileRepository.createQueryBuilder('file');
      qb.where('id IN (:...ids)', { ids });
      qb.andWhere('delete_time IS NOT NULL');
      qb.withDeleted();
      if (uid) {
        qb.andWhere('upload_uid = :uid', { uid });
      }
      const softDeleteFiles = await qb.getMany();
      if (softDeleteFiles.length) {
        const waitFiles = softDeleteFiles.map((ele) => ({
          source_path: BaseConst.uploadDir,
          flie_name: ele.file_name,
          destination_path: BaseConst.recycleDir,
        }));
        this.fileHandleQueue.add('moveFile', waitFiles);
      }
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 恢复文件 */
  async restoreFile(data: IdsDto) {
    const { ids } = data || {};
    const delRes = await this.fileRepository
      .createQueryBuilder('file')
      .where('id IN (:...ids)', { ids })
      .restore()
      .execute();
    if (delRes.affected) {
      // 移出回收站
      const softDeleteFiles = await this.fileRepository
        .createQueryBuilder('file')
        .where('id IN (:...ids)', { ids })
        .getMany();
      if (softDeleteFiles.length) {
        const waitFiles = softDeleteFiles.map((ele) => ({
          source_path: BaseConst.recycleDir,
          flie_name: ele.file_name,
          destination_path: BaseConst.uploadDir,
        }));
        this.fileHandleQueue.add('moveFile', waitFiles);
      }
      return ResultMsg.ok(delRes.affected + Msg.BATCH_RESTORE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.RESTORE_FAIL);
    }
  }

  /* 真删除文件 */
  async deleteFile(data: IdsDto) {
    const { ids } = data || {};
    // 删除本地文件
    const deleteRes = await this.fileRepository
      .createQueryBuilder('file')
      .where('id IN (:...ids)', { ids })
      .andWhere('delete_time IS NOT NULL')
      .withDeleted()
      .getMany();
    const deleteFiles = deleteRes.map((ele) => ({
      file_path: BaseConst.recycleDir,
      flie_name: ele.file_name,
    }));
    this.fileHandleQueue.add('deleteFile', deleteFiles);
    const delRes = await this.fileRepository
      .createQueryBuilder('file')
      .where('id IN (:...ids)', { ids })
      .andWhere('delete_time IS NOT NULL')
      .delete()
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 为已有文件生成哈希值 */
  async generateHashForFile() {
    let count = 0;
    let delCount = 0;
    const files = await this.fileRepository.find({
      select: ['id', 'file_name'],
    });
    const hashPromises = files.map(async (element) => {
      const filePath = path.join(BaseConst.uploadDir, element.file_name);
      const fileHash = await this.generateFileHash(filePath);
      if (fileHash) {
        const updateRes = await this.fileRepository
          .createQueryBuilder('file')
          .update()
          .set({ file_hash: fileHash })
          .where('id = :id', { id: element.id })
          .execute();
        if (updateRes.affected) {
          count += 1;
        }
      } else {
        const delRes = await this.fileRepository
          .createQueryBuilder('file')
          .delete()
          .where('id = :id', { id: element.id })
          .execute();
        if (delRes.affected) {
          delCount += 1;
        }
      }
    });
    try {
      await Promise.all(hashPromises);
      return ResultMsg.ok(
        `共${files.length}个文件，成功生成${count}个哈希值，删除无法读取的文件数据${delCount}条`,
      );
    } catch (error) {
      console.error(error);
      // 记录或处理错误
      return ResultMsg.fail('哈希值生成失败');
    }
  }

  /* 删除重复文件 */
  async deleteRepeatFile() {
    // 查找重复记录的 ID
    const duplicates = await this.fileRepository
      .createQueryBuilder('file')
      .select('file.id', 'id')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('file_name')
          .from(fileEntity, 'f')
          .groupBy('file_name')
          .having('COUNT(f.id) > 1')
          .getQuery();
        return 'file.file_name IN ' + subQuery;
      })
      .andWhere(
        'file.id NOT IN (SELECT MIN(f.id) FROM file f GROUP BY f.file_name)',
      )
      .getRawMany();

    // 删除重复记录
    const duplicateIds = duplicates.map((record) => record.id);
    if (duplicateIds.length) {
      await this.fileRepository.delete(duplicateIds);
    }
    return ResultMsg.ok(
      `共${duplicateIds.length}个重复文件，成功删除`,
      duplicateIds,
    );
  }

  /* 移动指定文件到另一个目录 */
  moveLocalFile(
    sourceFilePath: string,
    sourceFileName: string,
    destinationFilePath: string,
  ): boolean {
    const sourcePath = path.join(sourceFilePath, sourceFileName);
    const destinationPath = path.join(destinationFilePath, sourceFileName);

    // 检查源文件是否存在
    if (!fs.existsSync(sourcePath)) {
      console.error('源文件不存在');
      return false;
    }

    // 检查源路径是否为文件
    if (fs.statSync(sourcePath).isDirectory()) {
      console.error('是文件夹而非文件');
      return false;
    }

    // 检查目标目录是否存在，如果不存在则创建
    if (!fs.existsSync(destinationFilePath)) {
      fs.mkdirSync(destinationFilePath, { recursive: true });
    }

    // 尝试移动文件
    try {
      fs.renameSync(sourcePath, destinationPath);
      // console.log('移动文件成功' + destinationPath);
      return true;
    } catch (error) {
      console.error('移动文件失败', error);
      return false;
    }
  }

  /* 删除本地文件 */
  deleteLocalFile(filePath: string, name: string): boolean {
    if (fs.existsSync(filePath)) {
      const files = fs.readdirSync(filePath); //返回文件和子目录的数组
      if (files.includes(name)) {
        const truePath = path.join(filePath, name);
        if (fs.statSync(truePath).isDirectory()) {
          console.error('是文件夹而非文件');
          return false;
        } else {
          fs.unlinkSync(truePath);
          // console.log('删除文件成功' + truePath);
          return true;
        }
      } else {
        console.error('找不到文件夹或目录');
        return false;
      }
    } else {
      console.error('指定目录不存在');
      return false;
    }
  }

  /* 为文件生成哈希值 */
  generateFileHash(
    filePath: string,
    algorithm: string = 'sha256',
  ): Promise<string> {
    return new Promise((resolve) => {
      const hash = crypto.createHash(algorithm);
      const stream = fs.createReadStream(filePath);
      stream.on('data', (data) => hash.update(data as BinaryLike));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (error) => {
        console.log(error);
        resolve(null);
      });
    });
  }

  /* 下载文件到指定目录 */
  async downloadFile(
    url: string,
    outputPath = BaseConst.uploadDir,
    isAddTimeStamp = NumericStatus.False,
  ): Promise<{ filePath: string; fileName: string }> {
    try {
      // 创建目录（如果不存在）
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 下载文件
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream', // 以流的形式接收数据
      });

      // 文件保存路径
      let fileName = getFileNameFromUrl(url);
      if (isAddTimeStamp) {
        fileName = Date.now() + '_' + fileName;
      }
      const filePath = path.join(outputPath, fileName);

      // 将文件写入指定目录
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      return new Promise((resolve) => {
        writer.on('finish', () => resolve({ filePath, fileName }));
        writer.on('error', (error) => {
          console.error(error);
          resolve(null);
        });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /* 获取文件信息 */
  async getFileInfo(filePath: string): Promise<number> {
    return new Promise((resolve) => {
      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.error(error);
          resolve(0);
        } else {
          const { size } = stats;
          resolve(size || 0);
        }
      });
    });
  }
}
