import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from 'src/common/constants/database-enum.const';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private i18n: I18nService,
  ) {}

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
      throw new ForbiddenException(this.i18n.t('message.NO_LOGIN'));
    }

    const hasRole = requiredRoles.some((role) => user?.UserRole == role);
    if (!hasRole) {
      throw new ForbiddenException(this.i18n.t('message.NO_PERMISSION'));
    }

    return true;
  }
}
