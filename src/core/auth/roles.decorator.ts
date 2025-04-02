// 用于在装饰器中添加元数据的函数
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/commom/constants/base-enum.const';

// 路由添加权限控制
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// 路由添加角色控制
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
