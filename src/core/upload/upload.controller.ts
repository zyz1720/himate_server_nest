import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileUploadDto } from 'src/commom/dto/commom.dto';
import { AddFileDto } from 'src/modules/file/dto/add-file.dto';
import { UploadService } from './upload.service';

@ApiTags('文件上传')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '单文件上传' })
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  uploadFile(
    @UploadedFile(
      // 文件验证
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000000 })],
      }),
    )
    file: Express.Multer.File,
    @Query() query: AddFileDto,
  ) {
    return this.uploadService.upload(file, query);
  }
}
