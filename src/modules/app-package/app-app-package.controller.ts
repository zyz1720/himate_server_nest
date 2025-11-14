import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiOkRes,
  ApiOkPageRes,
} from 'src/common/response/api-response.decorator';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { AppPackageService } from './app-package.service';
import { AppFindAllAppPackageDto } from './dto/find-all-app-package.dto';
import { AppPackageEntity } from './entity/app-package.entity';

@ApiTags('App版本')
@ApiBearerAuth()
@Public()
@Controller('app/app-package')
export class AppAppPackageController {
  constructor(private readonly appPackageService: AppPackageService) {}

  @ApiOperation({ summary: '查询App的所有版本' })
  @ApiOkPageRes(AppPackageEntity)
  @Get()
  findAll(@Query() query: AppFindAllAppPackageDto) {
    return this.appPackageService.findAllAppPackage(query);
  }

  @ApiOperation({ summary: '获取App最新版本详情' })
  @ApiOkRes(AppPackageEntity)
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.appPackageService.findLatestAppPackage(name);
  }
}
