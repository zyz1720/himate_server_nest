import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Role } from 'src/commom/constants/base-enum.const';

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
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const type = context.getType();
    // 一旦使用Public注解，就通过
    if (requiredRoles) {
      return requiredRoles.includes(Role.Public);
    }

    // 单独处理Socket验证
    if (type === 'ws') {
      const client = context.switchToWs().getClient();
      const token = client.handshake.auth.Authorization;
      if (!token) {
        return false;
      }
      try {
        const decoded = this.jwtService.verify(token);
        if (decoded) {
          return true;
        }
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    // 例如调用 super.logIn(request) 来建立一个session
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
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
