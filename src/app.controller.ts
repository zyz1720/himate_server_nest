import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from './core/auth/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';
import { BaseConst } from './commom/constants/base.const';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Welcome to Himate!' })
  @Roles(Role.Public)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '获取系统常量' })
  @Get('BaseConst')
  getRoomName() {
    return { RoomName: BaseConst.RoomName };
  }
}
