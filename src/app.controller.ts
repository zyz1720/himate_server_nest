import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './core/auth/decorators/public.decorator';
import { ApiOkMsgRes } from 'src/common/response/api-response.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Welcome to Himate!' })
  @ApiOkMsgRes()
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
