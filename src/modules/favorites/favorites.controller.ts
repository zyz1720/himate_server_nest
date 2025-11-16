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
import { FavoritesService } from './favorites.service';
import { AddFavoritesDto } from './dto/add-favorites.dto';
import { UpdateFavoritesDto } from './dto/update-favorites.dto';
import { FindAllFavoritesDto } from './dto/find-all-favorites.dto';
import { FavoritesEntity } from './entity/favorites.entity';

@ApiTags('admin - 音乐收藏夹管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: '添加音乐收藏夹' })
  @ApiOkRes(FavoritesEntity)
  @Post()
  create(@Body() data: AddFavoritesDto) {
    return this.favoritesService.addFavorites(data);
  }

  @ApiOperation({ summary: '音乐收藏夹列表' })
  @ApiOkPageRes(FavoritesEntity)
  @Get()
  findAll(@Query() query: FindAllFavoritesDto) {
    return this.favoritesService.findAllFavorites(query);
  }

  @ApiOperation({ summary: '获取音乐收藏夹详情' })
  @ApiOkRes(FavoritesEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritesService.findOneFavorites(parseInt(id));
  }

  @ApiOperation({ summary: '修改音乐收藏夹信息' })
  @ApiOkRes(FavoritesEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateFavoritesDto) {
    return this.favoritesService.updateFavorites(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除音乐收藏夹' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.softDeleteFavorites(parseInt(id));
  }

  @ApiOperation({ summary: '恢复音乐收藏夹' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.favoritesService.restoreFavorites(parseInt(id));
  }

  @ApiOperation({ summary: '真删除音乐收藏夹' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.favoritesService.deleteFavorites(parseInt(id));
  }
}
