import { loadMusicMetadata } from 'music-metadata';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ParseFileDto } from 'src/modules/file/dto/parser-file.dto';
import { MusicService } from 'src/modules/music/music.service';
import { BaseConst } from 'src/commom/constants/base.const';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Processor('fileParser')
export class FileParserConsumer {
  constructor(private readonly musicService: MusicService) {}

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
}
