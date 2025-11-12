import { Controller, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileUploadDto, FileInfoDto } from './dto/upload.dto';
import { UploadService } from './upload.service';
import { FastifyRequest } from 'fastify';
import { Response } from 'src/common/response/api-response';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { ApiOkRes } from 'src/common/response/api-response.decorator';
import { FILE_DIR } from 'config/file_dir';

@ApiTags('文件上传')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '单文件上传' })
  @ApiOkRes(FileInfoDto)
  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async uploadFile(@Req() req: FastifyRequest) {
    const data = await req.file();
    const fileBuffer = await data.toBuffer();
    if (fileBuffer.length == 0) {
      return Response.fail('请上传文件');
    }

    const fieldsKey = data.fields?.key as any;
    const fileKey = fieldsKey?.value;

    if (!fileKey) {
      return Response.fail('请添加文件的key');
    }

    const filePath = join(FILE_DIR.UPLOAD, fileKey);
    // 确保上传目录存在，recursive: true会创建多级目录
    const fileDir = dirname(filePath);
    await mkdir(fileDir, { recursive: true });
    await writeFile(filePath, fileBuffer);

    const fileInfo = { key: fileKey, original_file_name: data.filename };
    return await this.uploadService.upload(fileInfo);
  }
}
