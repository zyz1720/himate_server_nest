import { Body, Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiOkMsgRes,
  ApiOkPageRes,
} from 'src/common/response/api-response.decorator';
import { FileService } from './file.service';
import { FindAllAppFileDto } from './dto/find-all-file.dto';
import { FileEntity } from './entity/file.entity';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { IdsDto } from 'src/common/dto/common.dto';

@ApiTags('app - 文件')
@ApiBearerAuth()
@Controller('app/file')
export class AppFileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: '用户的文件列表' })
  @ApiOkPageRes(FileEntity)
  @Get()
  findAll(@UserId() uid: number, @Query() query: FindAllAppFileDto) {
    return this.fileService.findAllAppFile(uid, query);
  }

  @ApiOperation({ summary: '用户删除文件' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@UserId() uid: number, @Param('id') id: string) {
    return this.fileService.softDeleteAppFile(uid, parseInt(id));
  }

  @ApiOperation({ summary: '用户批量删除文件' })
  @ApiOkMsgRes()
  @Delete('batch')
  batchRemove(@UserId() uid: number, @Body() data: IdsDto) {
    return this.fileService.batchSoftDeleteAppFile(uid, data);
  }
}
