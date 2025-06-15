import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FindAllFileDto } from './dto/findall-file.dto';
import { DownloadFileDto } from './dto/add-file.dto';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';
import { IdsDto } from 'src/commom/dto/commom.dto';
import { UserId } from 'src/core/auth/decorators/user.decorator';

@ApiTags('文件管理')
@ApiBearerAuth()
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: '下载文件到服务器' })
  @Roles(Role.VIP, Role.Admin)
  @Post('download')
  downloadFile(@Body() data: DownloadFileDto) {
    const { url, ...params } = data;
    return this.fileService.downloadSaveFile(url, params);
  }

  @ApiOperation({ summary: '查找文件' })
  @Get('list')
  findAll(@Query() query: FindAllFileDto, @UserId() uid: number) {
    return this.fileService.findAllFile(query, uid);
  }

  @ApiOperation({ summary: '软删除文件' })
  @Delete('del')
  remove(@Body() data: IdsDto, @UserId() uid: number) {
    return this.fileService.softDeleteFile(data, uid);
  }

  @ApiOperation({ summary: '恢复文件' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Body() data: IdsDto) {
    return this.fileService.restoreFile(data);
  }

  @ApiOperation({ summary: '真删除文件' })
  @Roles(Role.Admin)
  @Delete('realDel')
  realRemove(@Body() data: IdsDto) {
    return this.fileService.deleteFile(data);
  }

  @ApiOperation({ summary: '生成文件hash值' })
  @Roles(Role.Admin)
  @Post('hash')
  generateHash() {
    return this.fileService.generateHashForFile();
  }

  @ApiOperation({ summary: '删除重复文件' })
  @Roles(Role.Admin)
  @Delete('delRepeat')
  removeRepeatFile() {
    return this.fileService.deleteRepeatFile();
  }
}
