import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FindAllFileDto } from './dto/findall-file.dto';
import { DownloadFileDto } from './dto/add-file.dto';
import { Roles } from 'src/core/auth/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';
import { IdsDto } from 'src/commom/dto/commom.dto';

@ApiTags('文件管理')
@ApiBearerAuth()
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: '下载文件到服务器' })
  @Roles(Role.VIP, Role.Admin)
  @Get('download')
  async downloadFile(@Query() query: DownloadFileDto) {
    const { url, ...data } = query;
    return this.fileService.downloadSaveFile(url, data);
  }

  @ApiOperation({ summary: '查找文件' })
  @Get('list')
  async findAll(@Query() query: FindAllFileDto) {
    console.log(query);

    return this.fileService.findAllFile(query);
  }

  @ApiOperation({ summary: '删除文件' })
  @Delete('del')
  async remove(@Query() query: IdsDto) {
    console.log(query);

    return this.fileService.deleteFile(query);
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
