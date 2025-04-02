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
import { FindAllDto } from 'src/commom/dto/commom.dto';
import { Roles } from 'src/core/auth/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';

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
  findOne(@Query() query: FindOneAppPackageDto) {
    return this.appPackageService.findOneAppPackage(query);
  }

  @ApiOperation({ summary: '修改app包信息' })
  @Roles(Role.Admin)
  @Put('edit')
  update(@Body() data: UpdateAppPackageDto) {
    return this.appPackageService.updateAppPackage(data);
  }

  @ApiOperation({ summary: '删除app包' })
  @Roles(Role.Admin)
  @Delete('del')
  remove(@Query('id') id: number) {
    return this.appPackageService.removeAppPackage(id);
  }
}
