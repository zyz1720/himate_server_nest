import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiOkRes,
  ApiOkMsgRes,
  ApiOkPageRes,
} from 'src/common/response/api-response.decorator';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Role } from 'src/common/constants/database-enum.const';
import { FileService } from './file.service';
import { AddFileDto } from './dto/add-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FindAllFileDto } from './dto/find-all-file.dto';
import { FileEntity } from './entity/file.entity';

@ApiTags('文件管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: '添加文件' })
  @ApiOkRes(FileEntity)
  @Post()
  create(@Body() data: AddFileDto) {
    return this.fileService.addFile(data);
  }

  @ApiOperation({ summary: '文件列表' })
  @ApiOkPageRes(FileEntity)
  @Get()
  findAll(@Query() query: FindAllFileDto) {
    return this.fileService.findAllFile(query);
  }

  @ApiOperation({ summary: '获取文件详情' })
  @ApiOkRes(FileEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOneFile(parseInt(id));
  }

  @ApiOperation({ summary: '修改文件信息' })
  @ApiOkRes(FileEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateFileDto) {
    return this.fileService.updateFile(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除文件' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.softDeleteFile(parseInt(id));
  }

  @ApiOperation({ summary: '恢复文件' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.fileService.restoreFile(parseInt(id));
  }

  @ApiOperation({ summary: '真删除文件' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.fileService.deleteFile(parseInt(id));
  }
}
