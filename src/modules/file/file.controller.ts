import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FindAllFileDto } from './dto/findall-file.dto';
import { DelFileDto } from './dto/del-file.dto';
import { BooleanFromStringPipe } from 'src/commom/pipe/string-boolean.pipe';
import { DownloadFileDto } from './dto/add-file.dto';
import { Roles } from 'src/core/auth/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';

@ApiTags('文件管理')
@ApiBearerAuth()
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: '下载文件到服务器' })
  @Roles(Role.VIP, Role.Admin)
  @Get('download')
  async downloadFile(@Query(BooleanFromStringPipe) query: DownloadFileDto) {
    const { url, ...data } = query;
    return this.fileService.downloadSaveFile(url, data);
  }

  @ApiOperation({ summary: '查找文件' })
  @Get('list')
  async findAll(@Query(BooleanFromStringPipe) query: FindAllFileDto) {
    return this.fileService.findAllFile(query);
  }

  @ApiOperation({ summary: '按条件删除文件' })
  @Delete('del')
  async removeMoreFile(@Query(BooleanFromStringPipe) query: DelFileDto) {
    return this.fileService.deleteMoreFile(query);
  }

  @ApiOperation({ summary: '生成文件hash值' })
  @Roles(Role.Admin)
  @Post('hash')
  async generateHash() {
    return this.fileService.generateHashForFile();
  }

  @ApiOperation({ summary: '删除重复文件' })
  @Roles(Role.Admin)
  @Delete('delRepeat')
  async removeRepeatFile() {
    return this.fileService.deleteRepeatFile();
  }
}
