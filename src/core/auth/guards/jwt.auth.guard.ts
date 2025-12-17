import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { I18nService } from 'nestjs-i18n';
import { UserContext } from 'src/common/context/user.context';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private i18n: I18nService,
  ) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // 在这里添加自定义的认证逻辑
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 一旦使用Public注解，就通过
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(error: any, user: any, info: any) {
    // 处理token过期的特殊情况
    if (info && info.name == 'TokenExpiredError') {
      throw new UnauthorizedException(
        this.i18n.t('message.ACCESS_TOKEN_EXPIRED'),
      );
    }

    // 处理其他JWT错误
    if (info && info.name == 'JsonWebTokenError') {
      throw new UnauthorizedException(this.i18n.t('message.INVALID_TOKEN'));
    }

    if (error || !user) {
      throw error || new UnauthorizedException(this.i18n.t('message.NO_LOGIN'));
    }

    UserContext.run(user);

    return user;
  }
}
