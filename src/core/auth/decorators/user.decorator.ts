import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IJwtSign } from '../auth.service';

export const UserId = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IJwtSign = request.user;
    if (!user?.userId) {
      throw new ForbiddenException('please login first!');
    }
    return user.userId;
  },
);
