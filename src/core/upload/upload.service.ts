import { Injectable } from '@nestjs/common';
import { FileInfoDto } from './dto/upload.dto';
import { FileUtil } from 'src/common/utils/file.util';
import { FormatUtil } from 'src/common/utils/format.util';
import { FileService } from 'src/modules/file/file.service';
import { FILE_DIR } from 'config/file_dir';
import { join } from 'path';

@Injectable()
export class UploadService {
  constructor(private readonly fileService: FileService) {}
  /* 记录用户上传的文件 */
  async upload(fileInfo: FileInfoDto, fileBuffer: Buffer) {
    const { original_file_name } = fileInfo;
    const md5FileName = await FileUtil.generateFileMD5(original_file_name);

    const fileKey = join(FormatUtil.formatDate(), md5FileName);
    const filePath = join(FILE_DIR.UPLOAD, fileKey);

    await FileUtil.writeFileToPath(filePath, fileBuffer);
    const fileSize = fileBuffer.length;
    const fileHash = await FileUtil.generateFileHash(filePath);
    const newFileInfo = {
      ...fileInfo,
      original_file_name: original_file_name || md5FileName,
      file_key: fileKey,
      file_size: fileSize,
      file_hash: fileHash,
    };
    return this.fileService.addFileAndParse(newFileInfo, filePath);
  }
}
