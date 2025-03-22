import { Injectable } from '@nestjs/common';
import { Msg } from 'src/commom/constants/base-msg.const';
import { ResultMsg } from 'src/commom/utils/result';
import { AddFileDto } from 'src/modules/file/dto/add-file.dto';
import { FileService } from 'src/modules/file/file.service';

@Injectable()
export class UploadService {
  constructor(private readonly fileService: FileService) {}

  /* 记录用户上传的文件 */
  async upload(file: Express.Multer.File, query: AddFileDto) {
    const addRes = await this.fileService.addFile(
      file.path,
      file.filename,
      query,
    );
    if (addRes.success) {
      return ResultMsg.ok(Msg.UPLOAD_SUCCESS, addRes.data);
    } else {
      return ResultMsg.fail(addRes.message);
    }
  }
}
