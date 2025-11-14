// 本地策略
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/modules/user/user.service';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'account',
      passwordField: 'password',
    });
  }

  async validate(account: string, password: string) {
    const user = await this.userService.findOneUserEnabled({ account, password });
    if (!user) {
      throw new UnauthorizedException(
        I18nContext.current().t('message.NO_PERMISSION'),
      );
    }
    return user;
  }
}
