import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/core/auth/auth.service';
import { Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { UserContext } from 'src/common/context/user.context';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType();
    if (type !== 'ws') {
      return true;
    }
    const client = context.switchToWs().getClient();
    const token = client?.handshake?.auth?.Authorization;

    if (!token) {
      client.emit('error', Response.fail(this.i18n.t('message.NO_LOGIN')));
      client.disconnect();
      throw new WsException('Invalid token');
    }
    try {
      const user = this.authService.verifyToken(token);
      client.user = user;

      UserContext.run(user);

      return true;
    } catch {
      throw new WsException('Invalid token');
    }
  }
}
