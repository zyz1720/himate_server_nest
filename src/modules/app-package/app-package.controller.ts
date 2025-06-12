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
import { AppPackageService } from './app-package.service';
import { AddAppPackageDto } from './dto/add-app-package.dto';
import { FindOneAppPackageDto } from './dto/findone-app-package.dto';
import { UpdateAppPackageDto } from './dto/update-app-package.dto';
import { FindAllDto, IdsDto } from 'src/commom/dto/commom.dto';
import { Roles } from 'src/core/auth/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';
import { EmptyQueryPipe } from 'src/commom/pipe/empty-query.pipe';

@ApiTags('应用包管理')
@ApiBearerAuth()
@Controller('appPackage')
export class AppPackageController {
  constructor(private readonly appPackageService: AppPackageService) {}

  @ApiOperation({ summary: '添加app包' })
  @Roles(Role.Admin)
  @Post('add')
  create(@Body() data: AddAppPackageDto) {
    return this.appPackageService.addAppPackage(data);
  }

  @ApiOperation({ summary: 'app包列表' })
  @Roles(Role.Admin)
  @Get('list')
  findAll(@Query() query: FindAllDto) {
    return this.appPackageService.findAllAppPackage(query);
  }

  @ApiOperation({ summary: '获取app包详情' })
  @Get('detail')
  findOne(@Query(EmptyQueryPipe) query: FindOneAppPackageDto) {
    return this.appPackageService.findOneAppPackage(query);
  }

  @ApiOperation({ summary: '修改app包信息' })
  @Roles(Role.Admin)
  @Put('edit')
  update(@Body() data: UpdateAppPackageDto) {
    return this.appPackageService.updateAppPackage(data);
  }

  @ApiOperation({ summary: '软删除app包' })
  @Roles(Role.Admin)
  @Delete('del')
  remove(@Body() data: IdsDto) {
    return this.appPackageService.softDeleteAppPackage(data);
  }

  @ApiOperation({ summary: '恢复app包' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Body() data: IdsDto) {
    return this.appPackageService.restoreAppPackage(data);
  }

  @ApiOperation({ summary: '真删除app包' })
  @Roles(Role.Admin)
  @Delete('realDel')
  realRemove(@Body() data: IdsDto) {
    return this.appPackageService.deleteAppPackage(data);
  }
}
