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
import { MusicService } from './music.service';
import { AddMusicDto } from './dto/add-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { FindAllMusicDto } from './dto/find-all-music.dto';
import { MusicEntity } from './entity/music.entity';

@ApiTags('admin - 音乐管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '添加音乐' })
  @ApiOkRes(MusicEntity)
  @Post()
  create(@Body() data: AddMusicDto) {
    return this.musicService.addMusic(data);
  }

  @ApiOperation({ summary: '音乐列表' })
  @ApiOkPageRes(MusicEntity)
  @Get()
  findAll(@Query() query: FindAllMusicDto) {
    return this.musicService.findAllMusic(query);
  }

  @ApiOperation({ summary: '获取音乐详情' })
  @ApiOkRes(MusicEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOneMusic(parseInt(id));
  }

  @ApiOperation({ summary: '修改音乐信息' })
  @ApiOkRes(MusicEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateMusicDto) {
    return this.musicService.updateMusic(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除音乐' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicService.softDeleteMusic(parseInt(id));
  }

  @ApiOperation({ summary: '恢复音乐' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.musicService.restoreMusic(parseInt(id));
  }

  @ApiOperation({ summary: '真删除音乐' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.musicService.deleteMusic(parseInt(id));
  }
}
