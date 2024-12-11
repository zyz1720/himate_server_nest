import {
  Controller,
  Delete,
  Get,
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
import { UploadService } from './upload.service';
import { FileUploadDto } from 'src/commom/dto/commom.dto';
import { FindAllFileDto } from './dto/findall-file.dto';
import { AddFileDto } from './dto/add-file.dto';
import { DelFileDto } from './dto/del-file.dto';
import { BooleanFromStringPipe } from 'src/commom/pipe/string-boolean.pipe';

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

  @ApiOperation({ summary: '查找文件' })
  @Get('list')
  async findAll(@Query(BooleanFromStringPipe) query: FindAllFileDto) {
    return this.uploadService.findAllFile(query);
  }

  @ApiOperation({ summary: '按条件删除文件' })
  @Delete('del')
  async removeMoreFile(@Query() query: DelFileDto) {
    return this.uploadService.deleteMoreFile(query);
  }
}
