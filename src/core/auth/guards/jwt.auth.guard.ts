import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { IS_PUBLIC_KEY } from '../auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
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
    if (type === 'ws') {
      const client = context.switchToWs().getClient();
      const token = client.handshake?.auth?.Authorization;
      try {
        const decoded = this.jwtService.verify(token);
        if (decoded) {
          return true;
        }
        throw new WsException('请登录！');
      } catch (error) {
        console.log(error);
        throw new WsException('验证失败！');
      }
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // console.log(info);
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('请登录！') ||
        new WsException('请登录！')
      );
    }
    return user;
  }
}
