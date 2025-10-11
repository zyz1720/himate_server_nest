import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Msg } from 'src/common/constants/base-msg.const';

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
    if (type == 'ws') {
      const client = context.switchToWs().getClient();
      const token = client.handshake?.auth?.Authorization;
      try {
        const decoded = this.jwtService.verify(token);
        if (decoded) {
          return true;
        }
        return false;
      } catch (error) {
        console.log('JwtAuthGuard ws', error);
        return false;
      }
    }

    return super.canActivate(context);
  }

  handleRequest(error: any, user: any) {
    // console.log('JwtAuthGuard', error, user, info);
    if (error || !user) {
      throw error || new UnauthorizedException(Msg.NO_LOGIN);
    }
    return user;
  }
}
