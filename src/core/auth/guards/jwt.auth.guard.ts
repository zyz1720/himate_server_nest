import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { I18nService } from 'nestjs-i18n';
import { Response } from 'src/common/response/api-response';

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

    // 单独处理Socket验证
    const type = context.getType();
    if (type == 'ws') {
      const client = context.switchToWs().getClient();
      const token = client.handshake?.auth?.Authorization;
      if (token) {
        client.handshake.headers.authorization = token;
      }
    }

    return super.canActivate(context);
  }

  handleRequest(error: any, user: any, info: any, context: ExecutionContext) {
    // 处理token过期的特殊情况
    if (info && info.name === 'TokenExpiredError') {
      throw new UnauthorizedException(
        this.i18n.t('message.ACCESS_TOKEN_EXPIRED'),
      );
    }

    // 处理其他JWT错误
    if (info && info.name === 'JsonWebTokenError') {
      throw new UnauthorizedException(this.i18n.t('message.INVALID_TOKEN'));
    }

    if (error || !user) {
      throw error || new UnauthorizedException(this.i18n.t('message.NO_LOGIN'));
    }
    if ((error || !user) && context.getType() == 'ws') {
      const client = context.switchToWs().getClient();
      client.emit('error', Response.fail(this.i18n.t('message.NO_LOGIN')));
      client.disconnect();
      throw error || new UnauthorizedException(this.i18n.t('message.NO_LOGIN'));
    }

    // 将用户信息附加到客户端对象
    const client = context.switchToWs().getClient();
    client.user = user;

    return user;
  }
}
