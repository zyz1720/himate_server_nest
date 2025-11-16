import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaptchaService } from './captcha.service';
import { ApiOkMsgRes } from 'src/common/response/api-response.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('public - 验证码')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @ApiOperation({ summary: '获取图片验证码' })
  @ApiOkMsgRes()
  @Public()
  @Throttle({ default: { ttl: 1000, limit: 5 } })
  @Get()
  getCaptcha() {
    return this.captchaService.generateCaptcha();
  }
}
