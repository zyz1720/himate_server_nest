import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Role } from 'src/common/constants/database-enum.const';
import { MusicApiService } from './music-api.service';
import { FindMusicUrlDto, SearchMusicApiDto } from './dto/find-music-api.to';
import { UserId } from '../auth/decorators/user.decorator';
import { MatchMusicApiDto } from './dto/operate-music-api.dto';

@ApiTags('mix - 音乐API')
@ApiBearerAuth()
@Controller('music-api')
export class MusicApiController {
  constructor(private readonly musicApiService: MusicApiService) {}

  @ApiOperation({ summary: '查找音乐播放地址' })
  @Get('detail')
  findOne(@Query() query: FindMusicUrlDto) {
    return this.musicApiService.findMusicUrl(query);
  }

  @ApiOperation({ summary: '查找音乐' })
  @Get('list')
  findMore(@Query() query: SearchMusicApiDto) {
    return this.musicApiService.findMusicList(query);
  }

  @ApiOperation({ summary: '查找歌词' })
  @Get('lyric/:mid')
  findLyric(@Param('mid') id: string) {
    return this.musicApiService.findMusicLyric(id);
  }

  @ApiOperation({ summary: '匹配没有扩展的音乐信息' })
  @Roles(Role.Admin)
  @Get('match/:num')
  matchInfo(@Param('num') num: string) {
    return this.musicApiService.matchMusicInfo(parseInt(num));
  }

  @ApiOperation({ summary: '匹配音乐信息' })
  @Roles(Role.Admin)
  @Post('match')
  matchOneInfo(@Body() data: MatchMusicApiDto) {
    return this.musicApiService.matchMusicExtra(data);
  }

  @ApiOperation({ summary: '同步收藏夹' })
  @Get('sync/:url')
  syncFavorite(@UserId() uid: number, @Param('url') url: string) {
    return this.musicApiService.syncMusicFavorites(uid, url);
  }
}
