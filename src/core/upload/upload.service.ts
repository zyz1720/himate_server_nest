import { Injectable } from '@nestjs/common';
import { FileInfoDto } from './dto/upload.dto';
import { Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UploadService {
  constructor(private readonly i18n: I18nService) {}
  /* 记录用户上传的文件 */
  async upload(fileInfo: FileInfoDto) {
    // 添加上传后的业务逻辑
    return Response.ok(this.i18n.t('message.UPLOAD_SUCCESS'), fileInfo);
  }
}
