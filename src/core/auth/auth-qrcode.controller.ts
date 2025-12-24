import { AuthService } from './auth.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { LoginResponse } from './response/login.response';
import { QrCodeResponse } from './response/qrcode.response';
import {
  ApiOkMsgRes,
  ApiOkRes,
} from 'src/common/response/api-response.decorator';
import { Throttle } from '@nestjs/throttler';
import { UserLoginByQrCodeDto } from './dto/user-login-qrcode.dto';

@ApiTags('login - 二维码登录')
@ApiBearerAuth()
@Controller('qrcode')
export class AuthQrCodeController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '获取二维码信息' })
  @ApiOkRes(QrCodeResponse)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Public()
  @Get()
  geQrCode() {
    return this.authService.getLoginQrCode();
  }

  @ApiOperation({ summary: '检查二维码登录状态' })
  @ApiOkRes(LoginResponse)
  @Throttle({ default: { ttl: 60000, limit: 70 } })
  @Public()
  @Get(':qrcode_id')
  checkIsLogin(@Param('qrcode_id') qrcode_id: string) {
    return this.authService.checkIsQrCodeLogin(qrcode_id);
  }

  @ApiOperation({ summary: '确认登录' })
  @ApiOkMsgRes()
  @Post('login')
  qrCodeLogin(@Body() data: UserLoginByQrCodeDto) {
    return this.authService.qrCodeLogin(data);
  }
}
