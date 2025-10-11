import { Controller, Post, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileUploadDto } from 'src/common/dto/common.dto';
import { AddFileDto } from 'src/modules/file/dto/add-file.dto';
import { UploadService } from './upload.service';
import { FastifyRequest } from 'fastify';
import { BaseConst } from 'src/common/constants/base.const';
import { ResultMsg } from 'src/common/utils/result';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@ApiTags('文件上传')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '单文件上传' })
  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async uploadFile(@Query() query: AddFileDto, @Req() req: FastifyRequest) {
    const data = await req.file();
    const fileBuffer = await data.toBuffer();
    if (fileBuffer.length == 0) {
      return ResultMsg.fail('请上传文件');
    }

    const filePath = join(BaseConst.uploadDir, data.filename);
    await writeFile(filePath, fileBuffer);

    const fileInfo = { path: filePath, filename: data.filename };
    return await this.uploadService.upload(fileInfo, query);
  }
}
