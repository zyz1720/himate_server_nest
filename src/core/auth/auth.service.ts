import { Injectable } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { userEntity } from 'src/entities/user.entity';
import { UserLoginBycodeDto } from 'src/modules/user/dto/user-login-code.dto';
import { UserLoginBypasswordDto } from 'src/modules/user/dto/user-login-password.dto';
import { Msg } from 'src/commom/constants/base-msg.const';
import { ResultMsg } from 'src/commom/utils/result';

export interface IJwtSign {
  selfAccount: string;
  userId: number;
  account: string;
  UserRole: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /* jwt签名用 */
  async login(user: Partial<userEntity>) {
    const { id, self_account, account, user_role } = user || {};
    const payload = {
      selfAccount: self_account,
      account: account,
      userId: id,
      UserRole: user_role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
    };
  }

  /* 用户登录（账号密码） */
  async userlogin(data: UserLoginBypasswordDto) {
    const { account, self_account, password } = data || {};
    let user = null;
    if (account) {
      user = await this.userService.findOneUser({ account });
    }
    if (self_account) {
      user = await this.userService.findOneUser({ self_account });
    }
    if (user) {
      const enUser = await this.userService.findOneUser({
        account: user.account,
        password,
      });
      if (enUser) {
        const Token = await this.login(enUser);
        return ResultMsg.ok(Msg.LOGIN_SUCCESS, {
          userInfo: user,
          userToken: Token.access_token,
          tokenType: Token.token_type,
        });
      } else {
        return ResultMsg.fail(Msg.PASSWORD_ERROR);
      }
    } else {
      throw ResultMsg.fail('用户不存在');
    }
  }

  /* 用户登录（验证码） */
  async userloginBycode(data: UserLoginBycodeDto) {
    const { account, code } = data || {};
    const res = await this.userService.validateUser({ account, code });
    if (res.success) {
      const user = await this.userService.findOneUser({ account });
      if (user) {
        const Token = await this.login(user);
        return ResultMsg.ok(Msg.LOGIN_SUCCESS, {
          userInfo: user,
          userToken: Token.access_token,
          tokenType: Token.token_type,
        });
      } else {
        return ResultMsg.fail('用户不存在');
      }
    } else {
      return ResultMsg.fail(Msg.CODE_ERROR);
    }
  }
}
