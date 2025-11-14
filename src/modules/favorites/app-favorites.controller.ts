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
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { FavoritesService } from './favorites.service';
import { AppAddFavoritesDto } from './dto/add-favorites.dto';
import { UpdateFavoritesDto } from './dto/update-favorites.dto';
import { SearchFavoritesDto } from './dto/find-all-favorites.dto';
import { FindAllDto } from 'src/common/dto/common.dto';
import { FavoritesEntity } from './entity/favorites.entity';

@ApiTags('音乐收藏夹')
@ApiBearerAuth()
@Controller('app/favorites')
export class AppFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: '创建音乐收藏夹' })
  @ApiOkRes(FavoritesEntity)
  @Post()
  create(@UserId() uid: number, @Body() data: AppAddFavoritesDto) {
    return this.favoritesService.addFavorites({
      ...data,
      favorites_uid: uid,
    });
  }

  @ApiOperation({ summary: '用户音乐收藏夹列表' })
  @ApiOkPageRes(FavoritesEntity)
  @Get('self')
  findAll(@UserId() uid: number, @Query() query: FindAllDto) {
    return this.favoritesService.findUserFavorites(uid, query);
  }

  @ApiOperation({ summary: '搜索音乐收藏夹' })
  @ApiOkRes(FavoritesEntity)
  @Get()
  findOne(@Query() query: SearchFavoritesDto) {
    return this.favoritesService.searchFavorites(query);
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
