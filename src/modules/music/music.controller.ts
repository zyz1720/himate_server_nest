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
import { Roles } from 'src/core/auth/auth.decorator';
import { Role } from 'src/commom/constants/base-enum.const';

@ApiTags('音乐')
@ApiBearerAuth()
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '获取音乐详情' })
  @Get('detail')
  async findOne(@Query() query: FindOneMusicDto) {
    return this.musicService.findOneMusic(query);
  }

  @ApiOperation({ summary: '查找音乐' })
  @Get('list')
  async findAll(@Query() query: FindAllMusicDto) {
    return this.musicService.findAllMusic(query);
  }

  @ApiOperation({ summary: '修改音乐信息' })
  @Roles(Role.Admin)
  @Put('edit')
  async update(@Body() user: EditMusicDto) {
    return await this.musicService.updateMusic(user);
  }

  @ApiOperation({ summary: '删除音乐' })
  @Roles(Role.Admin)
  @Delete('del')
  async remove(@Query() query: IdsDto) {
    return this.musicService.deleteMusic(query);
  }
}

@ApiTags('音乐收藏夹')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '创建收藏夹' })
  @Post('add')
  async create(@Body() data: AddMusicFavoritesDto) {
    return this.musicService.addFavorites(data);
  }

  @ApiOperation({ summary: '查找收藏夹' })
  @Get('list')
  async findAll(@Query() query: FindAllFavoritesDto) {
    return this.musicService.findAllFavorites(query);
  }

  @ApiOperation({ summary: '收藏夹详情' })
  @Get('detail')
  async findOne(@Query() query: FindOneFavoritesDto) {
    return this.musicService.findOneFavorites(query);
  }

  @ApiOperation({ summary: '修改收藏夹信息' })
  @Put('edit')
  async update(@Body() data: EditFavoritesDto) {
    return await this.musicService.updateFavorites(data);
  }

  @ApiOperation({ summary: '默认收藏夹' })
  @Post('default')
  async updateDefault(@Body() data: EditDefaultFavoritesDto) {
    return await this.musicService.updateDefaultFavorites(data);
  }

  @ApiOperation({ summary: '删除收藏夹' })
  @Delete('del')
  async remove(@Query() query: IdsDto) {
    return this.musicService.deleteFavorites(query);
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
  async findOne(@Query() query: FindMusicUrlDto) {
    return this.musicService.findMusicUrl(query);
  }

  @ApiOperation({ summary: '查找音乐' })
  @Roles(Role.Admin)
  @Get('list')
  async findMore(@Query() query: FindMusicMoreDto) {
    return this.musicService.findMusicMoreList(query);
  }

  @ApiOperation({ summary: '查找歌词' })
  @Roles(Role.Admin)
  @Get('lyric')
  async findLyric(@Query('id') id: number) {
    return this.musicService.findMusicLyric(id);
  }

  @ApiOperation({ summary: '匹配音乐信息' })
  @Roles(Role.Admin)
  @Get('match')
  async matchInfo(@Query() query: MatchMusicMoreDto) {
    return this.musicService.matchMusicInfo(query);
  }

  @ApiOperation({ summary: '同步收藏夹' })
  @Post('sync')
  async syncFavorite(@Body() data: SyncFavoritesDto) {
    return this.musicService.syncMoreFavorites(data);
  }
}
