import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';
import { Msg } from 'src/commom/constants/base-msg.const';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有角色限制，直接放行
    if (!requiredRoles) {
      return true;
    }

    // 获取当前用户角色
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException(Msg.NO_LOGIN);
    }

    const hasRole = requiredRoles.some((role) => user?.UserRole == role);
    if (!hasRole) {
      throw new ForbiddenException(Msg.NO_PERMISSION);
    }

    return true;
  }
}
