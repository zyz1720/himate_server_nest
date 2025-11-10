import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Public } from './core/auth/decorators/public.decorator';
import { BaseConst } from './common/constants/base.const';
import { ResultMsg } from './common/utils/result';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Welcome to Himate!' })
  @ApiOkResponse({ type: ResultMsg, description: '成功响应' })
  @Public()
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
