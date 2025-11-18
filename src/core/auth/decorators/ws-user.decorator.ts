import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IJwtSign } from '../auth.service';
import { I18nContext } from 'nestjs-i18n';

export const WsUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    const user: IJwtSign = client.user;
    if (!user?.userId) {
      throw new ForbiddenException(I18nContext.current().t('message.NO_LOGIN'));
    }
    return user.userId;
  },
);
