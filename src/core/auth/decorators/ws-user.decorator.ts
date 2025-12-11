import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IJwtSign } from '../auth.service';

export const WsUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    const user: IJwtSign = client.user;
    if (!user?.userId) {
      throw new ForbiddenException('please login first!');
    }
    return user.userId;
  },
);
