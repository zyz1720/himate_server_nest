// 用于在装饰器中添加元数据的函数
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/commom/constants/base-enum.const';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
