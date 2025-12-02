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
import {
  ApiOkPageRes,
  ApiOkMsgRes,
} from 'src/common/response/api-response.decorator';
import { MusicService } from './music.service';
import { SearchMusicDto } from './dto/find-all-music.dto';
import { MusicEntity } from './entity/music.entity';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { AppendMusicDto } from './dto/operate-music.dto';
import { FindAllDto, IdsDto } from 'src/common/dto/common.dto';

@ApiTags('app - 音乐')
@ApiBearerAuth()
@Controller('app/music')
export class AppMusicController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '搜索音乐' })
  @ApiOkPageRes(MusicEntity)
  @Get()
  findAll(@Query() query: SearchMusicDto) {
    return this.musicService.searchMusic(query);
  }

  @ApiOperation({ summary: '收藏的音乐' })
  @ApiOkPageRes(MusicEntity)
  @Get('favorites/liked')
  getLiked(@UserId() uid: number, @Query() query: FindAllDto) {
    return this.musicService.findUserDefaultFavoritesMusic(uid, query);
  }

  @ApiOperation({ summary: '歌单的音乐' })
  @ApiOkPageRes(MusicEntity)
  @Get('favorites/:favoritesId')
  getFavorites(
    @UserId() uid: number,
    @Param('favoritesId') favoritesId: number,
    @Query() query: FindAllDto,
  ) {
    return this.musicService.findUserFavoritesMusic(uid, favoritesId, query);
  }

  @ApiOperation({ summary: '音乐详情' })
  @ApiOkPageRes(MusicEntity)
  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOneMusicDetails(parseInt(id));
  }

  @ApiOperation({ summary: '音乐是否收藏' })
  @ApiOkMsgRes()
  @Get('isLiked/:id')
  isLiked(@UserId() uid: number, @Param('id') id: string) {
    return this.musicService.isFavoriteMusic(uid, parseInt(id));
  }

  @ApiOperation({ summary: '收藏音乐' })
  @ApiOkMsgRes()
  @Post('like')
  like(@UserId() uid: number, @Body() data: IdsDto) {
    return this.musicService.favoritesMusic(uid, data);
  }

  @ApiOperation({ summary: '取消收藏音乐' })
  @ApiOkMsgRes()
  @Delete('dislike')
  dislike(@UserId() uid: number, @Body() data: IdsDto) {
    return this.musicService.dislikeMusic(uid, data);
  }

  @ApiOperation({ summary: '添加音乐到歌单' })
  @ApiOkPageRes(MusicEntity)
  @Post('favorites')
  append(@UserId() uid: number, @Body() data: AppendMusicDto) {
    return this.musicService.appendFavoritesMusic(uid, data);
  }

  @ApiOperation({ summary: '从歌单移除音乐' })
  @ApiOkPageRes(MusicEntity)
  @Delete('favorites/:favoritesId')
  remove(
    @UserId() uid: number,
    @Param('favoritesId') favoritesId: string,
    @Body() data: IdsDto,
  ) {
    return this.musicService.removeFavoritesMusic(
      uid,
      parseInt(favoritesId),
      data,
    );
  }
}
