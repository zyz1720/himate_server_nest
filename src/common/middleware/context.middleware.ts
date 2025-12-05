import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from 'src/core/auth/auth.service';
import { AsyncContext } from 'src/core/context/async-context.model';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const user = this.authService.verifyToken(token);
        AsyncContext.run(user, next);
      } catch (error) {
        Logger.error(error?.message);
        next();
      }
    } else {
      next();
    }
  }
}
