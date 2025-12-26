import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from 'src/core/auth/auth.service';
import { UserContext } from 'src/common/context/user.context';

@Injectable()
export class UserContextMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const user = this.authService.verifyToken(token);
        UserContext.run(user, next);
      } catch (error) {
        Logger.error(error?.message);
        next();
      }
    } else {
      next();
    }
  }
}
