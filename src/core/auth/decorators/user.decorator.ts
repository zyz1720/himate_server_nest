import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { IJwtSign } from '../auth.service';
import { Role } from 'src/common/constants/database-enum.const';

export const UserId = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IJwtSign = request.user;

    if (!user) {
      throw new ForbiddenException(I18nContext.current().t('message.NO_LOGIN'));
    }
    if (user?.UserRole == Role.Admin) {
      return false;
    }

    return user?.userId;
  },
);
