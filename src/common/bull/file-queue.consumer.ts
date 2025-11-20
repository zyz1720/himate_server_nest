import { Processor, Process } from '@nestjs/bull';
import { MusicService } from 'src/modules/music/music.service';
import { AddFileAndParseDto } from 'src/modules/file/dto/add-file.dto';
import { Job } from 'bull';
import { FILE_DIR } from 'config/file_dir';
import { FileUtil } from '../utils/file.util';
import { MoveTypeEnum } from 'src/common/constants/system-enum.const';
import {
  ForceDeleteFileDto,
  MoveFileDto,
} from 'src/modules/file/dto/operate-file.dto';
import { join } from 'path';

@Processor('file_queue')
export class FileQueueConsumer {
  constructor(private readonly musicService: MusicService) {}

  @Process('parse_music_metadata')
  async parseMusic(job: Job<AddFileAndParseDto>): Promise<boolean> {
    const data = job.data;
    const { file_path, original_file_name } = data || {};
    let musicData = {
      ...data,
      title: original_file_name.split('.')[0],
    } as any;
    const musicMetadata = await FileUtil.getMusicMetadata(file_path);
    if (musicMetadata) {
      musicData = {
        ...musicData,
        ...musicMetadata,
      };
    }
    const insertRes = await this.musicService.addMusic(musicData);
    if (insertRes.code == 0) {
      return true;
    } else {
      return false;
    }
  }

  @Process('create_thumbnail_image')
  async createThumbnail(job: Job<AddFileAndParseDto>): Promise<string | null> {
    const { file_path, file_key } = job.data || {};
    const thumbnail = await FileUtil.generateImageThumbnail(
      file_path,
      file_key,
    );
    return thumbnail;
  }

  @Process('move_file')
  async moveFile(job: Job<MoveFileDto[]>): Promise<boolean> {
    const files = job.data || [];
    const moveRes = files.map((moveInfo) => {
      const { file_key, move_type } = moveInfo;
      const uploadPath = join(FILE_DIR.UPLOAD, file_key);
      const recyclePath = join(FILE_DIR.RECYCLE_BIN, file_key);
      if (move_type == MoveTypeEnum.Delete) {
        return FileUtil.moveLocalFile(uploadPath, recyclePath);
      }
      if (move_type == MoveTypeEnum.Restore) {
        return FileUtil.moveLocalFile(recyclePath, uploadPath);
      }
    });
    try {
      await Promise.all(moveRes);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  @Process('force_delete_file')
  async forceDeleteFile(job: Job<ForceDeleteFileDto[]>): Promise<boolean> {
    const files = job.data || [];
    const delRes = files.map((file) => {
      const { file_key, is_recycle } = file;
      const uploadPath = join(FILE_DIR.UPLOAD, file_key);
      const recyclePath = join(FILE_DIR.RECYCLE_BIN, file_key);
      if (is_recycle) {
        return FileUtil.deleteLocalFile(recyclePath);
      } else {
        return FileUtil.deleteLocalFile(uploadPath);
      }
    });
    const thumbnailDelRes = files.map((file) => {
      const { file_key, is_image } = file;
      const thumbnailPath = join(FILE_DIR.THUMBNAIL, file_key);
      if (is_image) {
        return FileUtil.deleteLocalFile(thumbnailPath);
      }
    });
    try {
      await Promise.all([...delRes, ...thumbnailDelRes]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
