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
import { FindAllFavoritesDto, FindAllMusicDto } from './dto/findall-music.dto';
import { AddMusicFavoritesDto } from './dto/add-music.dto';
import {
  EditFavoritesDto,
  EditMusicDto,
  EditDefaultFavoritesDto,
} from './dto/edit-music.dto';
import { FindOneFavoritesDto } from './dto/findone-favorites.dto';
import { BooleanFromStringPipe } from 'src/commom/pipe/string-boolean.pipe';

@ApiTags('音乐')
@ApiBearerAuth()
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @ApiOperation({ summary: '查找音乐' })
  @Get('list')
  async findAll(@Query(BooleanFromStringPipe) query: FindAllMusicDto) {
    return this.musicService.findAllMusic(query);
  }

  @ApiOperation({ summary: '修改音乐信息' })
  @Put('edit')
  async update(@Body() user: EditMusicDto) {
    return await this.musicService.updateMusic(user);
  }

  @ApiOperation({ summary: '删除音乐' })
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
    return this.musicService.AddFavorites(data);
  }

  @ApiOperation({ summary: '查找收藏夹' })
  @Get('list')
  async findAll(@Query() query: FindAllFavoritesDto) {
    return this.musicService.findAllFavorites(query);
  }

  @ApiOperation({ summary: '收藏夹详情' })
  @Get('detail')
  async findOne(@Query(BooleanFromStringPipe) query: FindOneFavoritesDto) {
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
