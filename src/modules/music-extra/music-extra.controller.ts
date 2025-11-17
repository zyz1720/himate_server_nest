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
import { MusicExtraService } from './music-extra.service';
import { AddMusicExtraDto } from './dto/add-music-extra.dto';
import { UpdateMusicExtraDto } from './dto/update-music-extra.dto';
import { FindAllMusicExtraDto } from './dto/find-all-music-extra.dto';
import { MusicExtraEntity } from './entity/music-extra.entity';

@ApiTags('admin - 音乐扩展管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('music-extra')
export class MusicExtraController {
  constructor(private readonly musicExtraService: MusicExtraService) {}

  @ApiOperation({ summary: '添加音乐扩展' })
  @ApiOkRes(MusicExtraEntity)
  @Post()
  create(@Body() data: AddMusicExtraDto) {
    return this.musicExtraService.addMusicExtra(data);
  }

  @ApiOperation({ summary: '音乐扩展列表' })
  @ApiOkPageRes(MusicExtraEntity)
  @Get()
  findAll(@Query() query: FindAllMusicExtraDto) {
    return this.musicExtraService.findAllMusicExtra(query);
  }

  @ApiOperation({ summary: '获取音乐扩展详情' })
  @ApiOkRes(MusicExtraEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicExtraService.findOneMusicExtra(parseInt(id));
  }

  @ApiOperation({ summary: '修改音乐扩展信息' })
  @ApiOkRes(MusicExtraEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateMusicExtraDto) {
    return this.musicExtraService.updateMusicExtra(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除音乐扩展' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicExtraService.softDeleteMusicExtra(parseInt(id));
  }

  @ApiOperation({ summary: '恢复音乐扩展' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.musicExtraService.restoreMusicExtra(parseInt(id));
  }

  @ApiOperation({ summary: '真删除音乐扩展' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.musicExtraService.deleteMusicExtra(parseInt(id));
  }
}
