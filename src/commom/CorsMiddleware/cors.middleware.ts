import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const requestOrigin = req.header('Origin');

    const allowedOrigins = ['http://localhost:8080', 'http://192.168.2.143']; // 允许的源
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
