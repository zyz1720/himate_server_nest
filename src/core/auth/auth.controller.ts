import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { UserLoginByPasswordDto } from './dto/user-login-password.dto';
import { UserLoginByCodeDto } from './dto/user-login-code.dto';
import { LoginResponse } from './response/login.response';
import { ApiOkRes } from 'src/common/response/api-response.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('login - 用户登录')
@ApiBearerAuth()
@Public()
@Throttle({ default: { ttl: 60000, limit: 5 } })
@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户登录（账号/自定义账号）' })
  @ApiOkRes(LoginResponse)
  @Post('password')
  login(@Body() user: UserLoginByPasswordDto) {
    return this.authService.userLogin(user);
  }

  @ApiOperation({ summary: '验证码登录' })
  @ApiOkRes(LoginResponse)
  @Post('code')
  codeLogin(@Body() user: UserLoginByCodeDto) {
    return this.authService.userLoginByCode(user);
  }

  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiOkRes(LoginResponse)
  @Post('refresh')
  refreshToken(@Body() data: RefreshTokenDto) {
    return this.authService.refreshToken(data.refresh_token);
  }
}
