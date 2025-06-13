import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/* boolean字符串转换管道，暂不使用，已使用app.enableCors() */
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestOrigin = req.header('Origin');

    const allowedOrigins = ['http://localhost:8080', 'http://192.168.110.35']; // 允许的源
    const isAllow = allowedOrigins.includes(requestOrigin);
    // 在这里配置跨域相关的逻辑
    if (isAllow) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
    }

    // 如果请求是预检请求（OPTIONS），则直接返回响应，不执行后续操作
    if (req.method === 'OPTIONS') {
      res.status(200).send();
    } else {
      next(); // 继续执行后续中间件或控制器逻辑
    }
  }
}
