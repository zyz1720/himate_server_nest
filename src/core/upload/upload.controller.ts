import { Controller, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/upload.dto';
import { UploadService } from './upload.service';
import { FastifyRequest } from 'fastify';
import { Response } from 'src/common/response/api-response';
import { ApiOkRes } from 'src/common/response/api-response.decorator';
import {
  FileEntity,
  FileTypeEnum,
  UseTypeEnum,
} from 'src/modules/file/entity/file.entity';
import { I18nService } from 'nestjs-i18n';

@ApiTags('common - 文件上传')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly i18n: I18nService,
  ) {}

  @ApiOperation({ summary: '单文件上传' })
  @ApiOkRes(FileEntity)
  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async uploadFile(@Req() req: FastifyRequest) {
    const data = await req.file();
    const fileBuffer = await data.toBuffer();

    if (fileBuffer.length == 0) {
      return Response.fail(this.i18n.t('message.NO_FILE'));
    }

    const fileFields = data.fields as any as {
      file_type: { value: FileTypeEnum };
      use_type: { value: UseTypeEnum };
    };
    const file_type = fileFields?.file_type?.value;
    const use_type = fileFields?.use_type?.value;

    if (!file_type) {
      return Response.fail(this.i18n.t('message.NO_FILE_TYPE'));
    }
    if (!use_type) {
      return Response.fail(this.i18n.t('message.NO_USE_TYPE'));
    }
    if (!Object.values(FileTypeEnum).includes(file_type)) {
      return Response.fail(this.i18n.t('message.FILE_TYPE_INVALID'));
    }
    if (!Object.values(UseTypeEnum).includes(use_type)) {
      return Response.fail(this.i18n.t('message.USE_TYPE_INVALID'));
    }

    const fileInfo = {
      file_type: file_type,
      use_type: use_type,
      original_file_name: data.filename,
    };
    return await this.uploadService.upload(fileInfo, fileBuffer);
  }
}
