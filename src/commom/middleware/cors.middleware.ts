import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify'; // 替换 Express 的类型

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    // 使用 Fastify 的底层 Node.js 原生对象
    const requestOrigin = req.headers['origin'];

    const allowedOrigins = ['http://localhost:8080', 'http://192.168.110.35'];
    const isAllow = allowedOrigins.includes(requestOrigin);

    if (isAllow) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 200; // Fastify 原生对象使用 statusCode
      res.end();
    } else {
      next();
    }
  }
}
