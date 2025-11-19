import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkPageRes } from 'src/common/response/api-response.decorator';
import { MusicService } from './music.service';
import { SearchMusicDto } from './dto/find-all-music.dto';
import { MusicEntity } from './entity/music.entity';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { AppendMusicDto, OperateMusicDto } from './dto/operate-music.dto';
import { IdsDto } from 'src/common/dto/common.dto';

@ApiTags('app - 音乐')
@ApiBearerAuth()
@Controller('app/music')
export class AppMusicController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '用户搜索音乐' })
  @ApiOkPageRes(MusicEntity)
  @Get()
  findAll(@Query() query: SearchMusicDto) {
    return this.musicService.searchMusic(query);
  }

  @ApiOperation({ summary: '获取音乐详情' })
  @ApiOkPageRes(MusicEntity)
  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOneMusic(parseInt(id));
  }

  @ApiOperation({ summary: '用户默认收藏音乐' })
  @ApiOkPageRes(MusicEntity)
  @Post('default')
  default(@UserId() uid: number, @Body() data: IdsDto) {
    return this.musicService.favoritesMusic(uid, data);
  }

  @ApiOperation({ summary: '用户添加音乐到收藏夹' })
  @ApiOkPageRes(MusicEntity)
  @Post('favorites')
  append(@UserId() uid: number, @Body() data: AppendMusicDto) {
    return this.musicService.appendFavoritesMusic(uid, data);
  }

  @ApiOperation({ summary: '用户移除收藏夹音乐' })
  @ApiOkPageRes(MusicEntity)
  @Delete('favorites')
  remove(@UserId() uid: number, @Body() data: OperateMusicDto) {
    return this.musicService.removeFavoritesMusic(uid, data);
  }
}
