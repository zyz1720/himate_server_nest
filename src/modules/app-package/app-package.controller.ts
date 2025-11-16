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
import { AppPackageService } from './app-package.service';
import { AddAppPackageDto } from './dto/add-app-package.dto';
import { UpdateAppPackageDto } from './dto/update-app-package.dto';
import { FindAllAppPackageDto } from './dto/find-all-app-package.dto';
import { AppPackageEntity } from './entity/app-package.entity';

@ApiTags('admin - App版本管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('app-package')
export class AppPackageController {
  constructor(private readonly appPackageService: AppPackageService) {}

  @ApiOperation({ summary: '添加App版本' })
  @ApiOkRes(AppPackageEntity)
  @Post()
  create(@Body() data: AddAppPackageDto) {
    return this.appPackageService.addAppPackage(data);
  }

  @ApiOperation({ summary: 'App版本列表' })
  @ApiOkPageRes(AppPackageEntity)
  @Get()
  findAll(@Query() query: FindAllAppPackageDto) {
    return this.appPackageService.findAllAppPackage(query);
  }

  @ApiOperation({ summary: '获取App版本详情' })
  @ApiOkRes(AppPackageEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appPackageService.findOneAppPackage(parseInt(id));
  }

  @ApiOperation({ summary: '修改App版本信息' })
  @ApiOkRes(AppPackageEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateAppPackageDto) {
    return this.appPackageService.updateAppPackage(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除App版本' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appPackageService.softDeleteAppPackage(parseInt(id));
  }

  @ApiOperation({ summary: '恢复App版本' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.appPackageService.restoreAppPackage(parseInt(id));
  }

  @ApiOperation({ summary: '真删除App版本' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.appPackageService.deleteAppPackage(parseInt(id));
  }
}
