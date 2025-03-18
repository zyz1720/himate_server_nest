import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fileEntity } from 'src/core/upload/entities/file.entity';
import { ResultMsg } from 'src/commom/utils/result';
import { FindAllFileDto } from './dto/findall-file.dto';
import { ResultList } from 'src/commom/utils/result';
import { AddFileDto } from './dto/add-file.dto';
import { DelFileDto } from './dto/del-file.dto';
import {
  deleteFile,
  deleteThumbnail,
  generateFileHash,
} from 'src/commom/utils/base';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { BaseConst } from 'src/commom/constants/base.const';

@Injectable()
export class UploadService {
  constructor(
    @InjectQueue('fileParser') private readonly fileParserQueue: Queue,
    @InjectRepository(fileEntity)
    private readonly fileRepository: Repository<fileEntity>,
  ) {}

  /* 记录用户上传的文件 */
  async upload(file: Express.Multer.File, query: AddFileDto) {
    const { uid, file_type, use_type } = query || {};
    // console.log('file:', file);
    const fileHash = await generateFileHash(file.path);
    if (!fileHash) {
      return ResultMsg.fail('读取文件失败！');
    }
    const existFile = await this.fileRepository.findOne({
      where: { file_name: file.filename },
    });
    if (existFile) {
      return ResultMsg.ok('已存在同名文件', existFile);
    }
    const fileForm = {
      file_name: file.filename,
      upload_uid: uid,
      file_size: file.size,
      file_type: file_type,
      use_type: use_type,
      file_path: file.path,
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
      if (file_type === 'audio' && use_type === 'music') {
        this.fileParserQueue.add('addMusic', fileForm);
      }
      if (file_type === 'image') {
        this.fileParserQueue.add('createThumbnail', fileForm);
      }
      return ResultMsg.ok('上传成功', fileData);
    } else {
      return ResultMsg.fail('上传失败');
    }
  }

  /* 获取用户上传的文件列表 */
  async findAllFile(query: FindAllFileDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      ids,
      upload_uid,
      file_name,
      file_size,
      file_type,
      use_type,
      file_hash,
      create_time,
      isPaging = true,
    } = query || {};
    const qb = this.fileRepository.createQueryBuilder('file');
    if (ids) {
      qb.andWhere('file.id IN (:...ids)', { ids: ids });
    }
    if (upload_uid) {
      qb.andWhere('file.upload_uid = :uid', { uid: upload_uid });
    }
    if (file_name) {
      qb.andWhere('file.file_name LIKE :name', { name: `%${file_name}%` });
    }
    if (file_size) {
      qb.andWhere('file.file_size > :size', { size: file_size });
    }
    if (file_type) {
      qb.andWhere('file.file_type = :type', { type: file_type });
    }
    if (use_type) {
      qb.andWhere('file.use_type = :useType', { useType: use_type });
    }
    if (file_hash) {
      qb.andWhere('file.file_hash = :fileHash', { fileHash: file_hash });
    }
    if (create_time) {
      const time = new Date(create_time);
      qb.andWhere('file.create_time < :time', { time: time });
    }
    qb.orderBy('file.create_time', 'DESC');
    const count = await qb.getCount();
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * (pageNum - 1));
    }
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /* 删除用户上传的文件 */
  async deleteMoreFile(query: DelFileDto) {
    const { isForce } = query || {};
    const { list: files } = await this.findAllFile({
      isPaging: false,
      ...query,
    });
    let delCount = 0;
    if (files.length) {
      const deletionPromises = files.map(async (element) => {
        let delThumbnailFlag = true;
        if (element.file_type === 'image') {
          delThumbnailFlag = deleteThumbnail(element.file_name);
        }
        const delUploadFlag = deleteFile(element.file_name);
        if ((delUploadFlag && delThumbnailFlag) || isForce) {
          try {
            const delRes = await this.fileRepository
              .createQueryBuilder('file')
              .delete()
              .where('file.id = :id', { id: element.id })
              .execute();
            if (delRes.affected) {
              delCount += 1;
            }
          } catch (err) {
            console.error(`删除文件 ${element.file_name} 时出错: `, err);
            // 记录或处理错误
          }
        }
      });
      await Promise.all(deletionPromises);
    }

    return ResultMsg.ok(`共${files.length}个文件，成功删除${delCount}个`);
  }

  /* 为已有文件生成哈希值 */
  async generateHashForFile() {
    const files = await this.fileRepository.find({
      select: ['id', 'file_name'],
    });
    const hashPromises = files.map(async (element) => {
      const fileHash = await generateFileHash(
        BaseConst.uploadDir + '/' + element.file_name,
      );
      if (fileHash) {
        const updateRes = await this.fileRepository
          .createQueryBuilder('file')
          .update()
          .set({ file_hash: fileHash })
          .where('file.id = :id', { id: element.id })
          .execute();
        if (updateRes.affected) {
          console.log(`更新文件 ${element.file_name} 的哈希值成功`);
        } else {
          console.log(`更新文件 ${element.file_name} 的哈希值失败`);
        }
      } else {
        const delRes = await this.fileRepository
          .createQueryBuilder('file')
          .delete()
          .where('file.id = :id', { id: element.id })
          .execute();
        if (delRes.affected) {
          console.log(`删除文件 ${element.file_name} 失败`);
        } else {
          console.log(`删除文件 ${element.file_name} 成功`);
        }
      }
    });
    try {
      await Promise.all(hashPromises);
      return ResultMsg.ok('哈希值生成完成');
    } catch (error) {
      console.error('生成哈希值时出错: ', error);
      // 记录或处理错误
      return ResultMsg.fail('哈希值生成失败');
    }
  }
}
