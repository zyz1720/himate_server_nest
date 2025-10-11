import { loadMusicMetadata } from 'music-metadata';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ParseFileDto } from 'src/modules/file/dto/parser-file.dto';
import { MusicService } from 'src/modules/music/music.service';
import { FileService } from 'src/modules/file/file.service';
import { MoveFileDto } from 'src/modules/file/dto/move-file.dto';
import { BaseConst } from 'src/common/constants/base.const';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { DelFileDto } from 'src/modules/file/dto/del-file.dto';

@Processor('fileHandle')
export class fileHandleConsumer {
  constructor(
    private readonly musicService: MusicService,
    private readonly fileService: FileService,
  ) {}

  @Process('addMusic')
  async parseMusic(job: Job<ParseFileDto>): Promise<boolean> {
    const data = job.data;
    const { file_path } = data || {};
    let miusicData = {
      ...data,
      title: data.file_name.split('.')[0],
    } as any;
    try {
      const mm = await loadMusicMetadata();
      const metadata = await mm.parseFile(file_path);
      const { duration } = metadata.format || {};
      const { title } = metadata.common || {};
      const musicForm = {
        ...data,
        ...(metadata?.format || {}),
        ...(metadata?.common || {}),
      };
      musicForm.duration = Math.round(duration || 0);
      if (!title) {
        musicForm.title = data.file_name.split('.')[0];
      }
      miusicData = musicForm;
    } catch (error) {
      console.error('解析音乐信息失败', error);
    }
    const insertRes = await this.musicService.addMusic(miusicData);
    if (insertRes.success) {
      return true;
    } else {
      return false;
    }
  }

  @Process('createThumbnail')
  async createThumbnail(job: Job<ParseFileDto>): Promise<boolean> {
    const { file_path, file_name } = job.data || {};
    try {
      const curPath = BaseConst.ThumbnailDir;
      if (!fs.existsSync(curPath)) {
        fs.mkdirSync(curPath, { recursive: true });
      }
      await sharp(file_path)
        .resize(512, null) // 这里设置压缩尺寸
        .jpeg({ quality: 50 }) // 这里以 jpeg 格式压缩
        .toFile(curPath + '/' + file_name);
      // console.log('图片压缩成功:', curPath);
      return true;
    } catch (error) {
      console.error('压缩图片时发生错误:', error);
      return false;
    }
  }

  @Process('moveFile')
  moveFile(job: Job<MoveFileDto[]>): boolean {
    const files = job.data || [];
    files.forEach((file) => {
      const { source_path, flie_name, destination_path } = file;
      this.fileService.moveLocalFile(source_path, flie_name, destination_path);
    });
    return true;
  }

  @Process('deleteFile')
  deleteFile(job: Job<DelFileDto[]>): boolean {
    const files = job.data || [];
    files.forEach((file) => {
      const { file_path, flie_name } = file;
      this.fileService.deleteLocalFile(file_path, flie_name);
    });
    return true;
  }
}
