import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Msg } from 'src/commom/constants/base-msg.const';
import { IJwtSign } from '../auth.service';
import { Role } from 'src/commom/constants/base-enum.const';

export const UserId = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IJwtSign = request.user;

    if (!user) {
      throw new ForbiddenException(Msg.NO_LOGIN);
    }
    if (user?.UserRole == Role.Admin) {
      return false;
    }

    return user?.userId;
  },
);
