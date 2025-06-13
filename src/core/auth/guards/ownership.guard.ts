import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OWNERSHIP_KEY } from '../auth.decorator';
import { DataSource } from 'typeorm';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const entityType = this.reflector.getAllAndOverride<string>(OWNERSHIP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 获取当前用户角色
    const { user, query, body, params } = context.switchToHttp().getRequest();

    console.log(entityType);

    console.log('user', user, 'query', query, 'body', body, 'params', params);

    // 获取当前用户角色
    if (!user) {
      throw new ForbiddenException('请登录!');
    }

    // 查询资源
    const repository = this.dataSource.getRepository(entityType);
    const resource = await repository.findOne({
      where: { id: user.userId },
      select: ['create_by'],
    });

    if (!resource) {
      throw new ForbiddenException('Resource not found');
    }

    if (resource.creator_uid !== user.userId) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
