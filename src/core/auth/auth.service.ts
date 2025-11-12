import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { userEntity } from 'src/modules/user/entity/user.entity';
import { UserLoginByCodeDto } from 'src/core/auth/dto/user-login-code.dto';
import { UserLoginByPasswordDto } from 'src/core/auth/dto/user-login-password.dto';
import { I18nService } from 'nestjs-i18n';
import { Response } from 'src/common/response/api-response';
import { LoginResponseDto } from './dto/login-response.dto';
import { ConfigService } from '@nestjs/config';

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
  ) {}

  /* jwt签名用 - 生成双token */
  async login(user: Partial<userEntity>) {
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

      return new LoginResponseDto(accessToken, refreshToken, 'bearer');
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(this.i18n.t('message.LOGIN_FAILED'));
    }
  }

  /* 用户登录（账号密码） */
  async userLogin(data: UserLoginByPasswordDto) {
    const { account, password } = data || {};
    let user = null as Partial<userEntity>;
    user = await this.userService.findUserByAP(account, password);
    if (user) {
      const Token = await this.login(user);
      return Response.ok(this.i18n.t('message.LOGIN_SUCCESS'), Token);
    } else {
      return Response.fail(this.i18n.t('message.PASSWORD_OR_ACCOUNT_ERROR'));
    }
  }

  /* 用户登录（验证码） */
  async userLoginByCode(data: UserLoginByCodeDto) {
    const { account, code } = data || {};
    const res = await this.userService.validateUser({ account, code });
    if (res.code === 0) {
      const user = await this.userService.findOneUser({ account });
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
      const user = await this.userService.findOneUser({ id: userId, account });
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
}
