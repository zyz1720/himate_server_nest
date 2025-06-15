import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MusicService } from './music.service';
import { IdsDto } from 'src/commom/dto/commom.dto';
import {
  FindAllFavoritesDto,
  FindAllMusicDto,
  FindMusicMoreDto,
  FindMusicUrlDto,
} from './dto/findall-music.dto';
import { AddMusicFavoritesDto, SyncFavoritesDto } from './dto/add-music.dto';
import {
  EditFavoritesDto,
  EditMusicDto,
  EditDefaultFavoritesDto,
  MatchMusicMoreDto,
} from './dto/edit-music.dto';
import { FindOneMusicDto } from './dto/findone-music.dto';
import { FindOneFavoritesDto } from './dto/findone-favorites.dto';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { EmptyQueryPipe } from 'src/commom/pipe/empty-query.pipe';

@ApiTags('音乐')
@ApiBearerAuth()
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '获取音乐详情' })
  @Get('detail')
  findOne(@Query(EmptyQueryPipe) query: FindOneMusicDto) {
    return this.musicService.findOneMusic(query);
  }

  @ApiOperation({ summary: '查找音乐' })
  @Get('list')
  findAll(@Query() query: FindAllMusicDto) {
    return this.musicService.findAllMusic(query);
  }

  @ApiOperation({ summary: '修改音乐信息' })
  @Roles(Role.Admin)
  @Put('edit')
  update(@Body() user: EditMusicDto) {
    return this.musicService.updateMusic(user);
  }

  @ApiOperation({ summary: '软删除音乐' })
  @Roles(Role.Admin)
  @Delete('del')
  remove(@Body() data: IdsDto) {
    return this.musicService.deleteMusic(data);
  }

  @ApiOperation({ summary: '恢复音乐' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Body() data: IdsDto) {
    return this.musicService.restoreMusic(data);
  }

  @ApiOperation({ summary: '真删除音乐' })
  @Roles(Role.Admin)
  @Delete('realDel')
  realRemove(@Body() data: IdsDto) {
    return this.musicService.realDeleteMusic(data);
  }
}

@ApiTags('音乐收藏夹')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '创建收藏夹' })
  @Post('add')
  create(@Body() data: AddMusicFavoritesDto) {
    return this.musicService.addFavorites(data);
  }

  @ApiOperation({ summary: '查找收藏夹' })
  @Get('list')
  findAll(@Query() query: FindAllFavoritesDto) {
    return this.musicService.findAllFavorites(query);
  }

  @ApiOperation({ summary: '收藏夹详情' })
  @Get('detail')
  findOne(@Query(EmptyQueryPipe) query: FindOneFavoritesDto) {
    return this.musicService.findOneFavorites(query);
  }

  @ApiOperation({ summary: '修改收藏夹信息' })
  @Put('edit')
  update(@Body() data: EditFavoritesDto, @UserId() uid: number) {
    return this.musicService.updateFavorites(data, uid);
  }

  @ApiOperation({ summary: '默认收藏夹' })
  @Post('default')
  updateDefault(@Body() data: EditDefaultFavoritesDto, @UserId() uid: number) {
    return this.musicService.updateDefaultFavorites(data, uid);
  }

  @ApiOperation({ summary: '软删除收藏夹' })
  @Delete('del')
  remove(@Body() data: IdsDto, @UserId() uid: number) {
    return this.musicService.deleteFavorites(data, uid);
  }

  @ApiOperation({ summary: '恢复收藏夹' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Body() data: IdsDto) {
    return this.musicService.restoreFavorites(data);
  }

  @ApiOperation({ summary: '真删除收藏夹' })
  @Roles(Role.Admin)
  @Delete('realDel')
  realRemove(@Body() data: IdsDto) {
    return this.musicService.realDeleteFavorites(data);
  }
}

@ApiTags('第三方音乐')
@ApiBearerAuth()
@Controller('musicMore')
export class musicMoreController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '查找音乐播放地址' })
  @Roles(Role.Admin)
  @Get('detail')
  findOne(@Query() query: FindMusicUrlDto) {
    return this.musicService.findMusicUrl(query);
  }

  @ApiOperation({ summary: '查找音乐' })
  @Roles(Role.Admin)
  @Get('list')
  findMore(@Query() query: FindMusicMoreDto) {
    return this.musicService.findMusicMoreList(query);
  }

  @ApiOperation({ summary: '查找歌词' })
  @Roles(Role.Admin)
  @Get('lyric')
  findLyric(@Query('id') id: string) {
    return this.musicService.findMusicLyric(id);
  }

  @ApiOperation({ summary: '匹配音乐信息' })
  @Roles(Role.Admin)
  @Get('match')
  matchInfo(@Query() query: MatchMusicMoreDto) {
    return this.musicService.matchMusicInfo(query);
  }

  @ApiOperation({ summary: '同步收藏夹' })
  @Post('sync')
  syncFavorite(@Body() data: SyncFavoritesDto) {
    return this.musicService.syncMoreFavorites(data);
  }
}
