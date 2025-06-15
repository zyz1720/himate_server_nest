// 用于在装饰器中添加元数据的函数
import { SetMetadata } from '@nestjs/common';

// 路由添加权限控制
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
