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
import { UpdateUserFavoritesDto } from './dto/update-favorites.dto';
import { SearchFavoritesDto } from './dto/find-all-favorites.dto';
import { FindAllDto, IdsDto } from 'src/common/dto/common.dto';
import { FavoritesEntity } from './entity/favorites.entity';

@ApiTags('app - 音乐收藏夹')
@ApiBearerAuth()
@Controller('app/favorites')
export class AppFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: '创建歌单' })
  @ApiOkRes(FavoritesEntity)
  @Post()
  create(@UserId() uid: number, @Body() data: AppAddFavoritesDto) {
    return this.favoritesService.addFavorites({
      ...data,
      favorites_uid: uid,
    });
  }

  @ApiOperation({ summary: '我的歌单' })
  @ApiOkPageRes(FavoritesEntity)
  @Get('oneself')
  findAll(@UserId() uid: number, @Query() query: FindAllDto) {
    return this.favoritesService.findUserFavorites(uid, query);
  }

  @ApiOperation({ summary: '搜索歌单' })
  @ApiOkRes(FavoritesEntity)
  @Get()
  search(@Query() query: SearchFavoritesDto) {
    return this.favoritesService.searchFavorites(query);
  }

  @ApiOperation({ summary: '歌单详情' })
  @ApiOkPageRes(FavoritesEntity)
  @Get('detail/:id')
  findDetail(@UserId() uid: number, @Param('id') id: string) {
    return this.favoritesService.findUserFavoritesDetail(uid, parseInt(id));
  }

  @ApiOperation({ summary: '默认收藏详情' })
  @ApiOkPageRes(FavoritesEntity)
  @Get('default')
  findDefault(@UserId() uid: number) {
    return this.favoritesService.findUserDefaultFavorites(uid);
  }

  @ApiOperation({ summary: '修改歌单信息' })
  @ApiOkRes(FavoritesEntity)
  @Put(':id')
  update(
    @UserId() uid: number,
    @Param('id') id: string,
    @Body() data: UpdateUserFavoritesDto,
  ) {
    return this.favoritesService.updateUserFavorites(uid, parseInt(id), data);
  }

  @ApiOperation({ summary: '批量删除歌单' })
  @ApiOkMsgRes()
  @Delete('batch')
  removeBatch(@UserId() uid: number, @Body() data: IdsDto) {
    return this.favoritesService.softDeleteUserFavoritesBatch(uid, data);
  }
}
