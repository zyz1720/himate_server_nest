import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';

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

    const { user } = context.switchToHttp().getRequest();

    const hasRole = requiredRoles.some((role) =>
      user?.UserRole?.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException('您没有此操作权限');
    }

    return true;
  }
}
