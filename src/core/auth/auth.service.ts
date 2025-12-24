import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { UserLoginByCodeDto } from 'src/core/auth/dto/user-login-code.dto';
import { UserLoginByPasswordDto } from 'src/core/auth/dto/user-login-password.dto';
import { I18nService } from 'nestjs-i18n';
import { Response } from 'src/common/response/api-response';
import { LoginResponse } from './response/login.response';
import { ConfigService } from '@nestjs/config';
import { StringUtil } from 'src/common/utils/string.util';
import { RedisService } from 'src/core/redis/redis.service';
import { UserLoginByQrCodeDto } from './dto/user-login-qrcode.dto';

export interface IJwtSign {
  selfAccount: string;
  account: string;
  userId: number;
  UserRole: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  /* jwt签名用 - 生成双token */
  async login(user: Partial<UserEntity>) {
    try {
      const { id, self_account, account, user_role } = user || {};
      const payload = {
        selfAccount: self_account,
        account: account,
        userId: id,
        UserRole: user_role,
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      });

      const refreshTokenPayload = {
        userId: id,
        account: account,
      };
      const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      });

      return new LoginResponse(accessToken, refreshToken, 'bearer');
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(this.i18n.t('message.LOGIN_FAILED'));
    }
  }

  /* 验证jwt token */
  verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return decoded as IJwtSign;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(this.i18n.t('message.OPERATE_ERROR'));
    }
  }

  /* 用户登录（账号密码） */
  async userLogin(data: UserLoginByPasswordDto) {
    const { account, password } = data || {};
    const user = await this.userService.findUserByAPEnabled(account, password);
    if (user) {
      const authInfo = await this.login(user);
      return Response.ok(this.i18n.t('message.LOGIN_SUCCESS'), authInfo);
    } else {
      return Response.fail(this.i18n.t('message.PASSWORD_OR_ACCOUNT_ERROR'));
    }
  }

  /* 用户登录（验证码） */
  async userLoginByCode(data: UserLoginByCodeDto) {
    const { account, code } = data || {};
    const res = await this.userService.validateUser({ account, code });
    if (res.code == 0) {
      const user = await this.userService.findOneUserEnabled({ account });
      if (user) {
        const Token = await this.login(user);
        return Response.ok(this.i18n.t('message.LOGIN_SUCCESS'), Token);
      } else {
        return Response.fail(this.i18n.t('message.NO_USER'));
      }
    } else {
      return Response.fail(this.i18n.t('message.CODE_ERROR'));
    }
  }

  /* 刷新访问令牌 */
  async refreshToken(refreshToken: string) {
    try {
      // 验证refresh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const { userId, account } = decoded;

      // 根据用户ID获取用户信息
      const user = await this.userService.findOneUserEnabled({
        id: userId,
        account,
      });
      if (!user) {
        throw new UnauthorizedException(this.i18n.t('message.NO_PERMISSION'));
      }

      const Token = await this.login(user);
      return Response.ok(this.i18n.t('message.TOKEN_REFRESH_SUCCESS'), Token);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(
        error?.message || this.i18n.t('message.OPERATE_ERROR'),
      );
    }
  }

  /* 获取二维码信息 */
  async getLoginQrCode() {
    const qrcode_id = StringUtil.createUUID();
    this.redisService.setValue(qrcode_id, qrcode_id, 60);
    return Response.ok(this.i18n.t('message.GET_SUCCESS'), {
      qrcode_id,
      created_at: new Date().toISOString(),
    });
  }

  /* 检查二维码是否登录 */
  async checkIsQrCodeLogin(qrcode_id: string) {
    const loginInfo = await this.redisService.getValue(qrcode_id);
    return loginInfo;
  }

  /* 确认登录 */
  async qrCodeLogin(data: UserLoginByQrCodeDto) {
    const { qrcode_id, refresh_token } = data || {};
    const loginInfo = await this.redisService.getValue(qrcode_id);
    if (!loginInfo) {
      return Response.fail(this.i18n.t('message.CAPTCHA_EXPIRED'));
    }
    const result = await this.refreshToken(refresh_token);
    if (result.code == 0) {
      this.redisService.setValue(qrcode_id, JSON.stringify(result.data), 60);
    }
    return result;
  }
}
