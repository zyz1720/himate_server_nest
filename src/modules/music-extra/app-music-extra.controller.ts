import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkRes } from 'src/common/response/api-response.decorator';
import { MusicExtraService } from './music-extra.service';
import { MusicExtraEntity } from './entity/music-extra.entity';

@ApiTags('app - 音乐扩展管理')
@ApiBearerAuth()
@Controller('app/music-extra')
export class AppMusicExtraController {
  constructor(private readonly musicExtraService: MusicExtraService) {}

  @ApiOperation({ summary: '获取音乐扩展详情' })
  @ApiOkRes(MusicExtraEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicExtraService.findOneMusicExtra(parseInt(id));
  }
}
