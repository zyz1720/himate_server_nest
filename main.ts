import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './src/common/filters/http-exception.filter';
import { DatabaseExceptionFilter } from 'src/common/filters/database-exception.filter';
import { WebSocketExceptionFilter } from 'src/common/filters/ws-exception.filter';
import { HttpReqTransformInterceptor } from './src/common/interceptor/http-req.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { FILE_DIR } from './config/file_dir';
import { FormatUtil } from './src/common/utils/format.util';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        timestamp() {
          return `,"time":"${FormatUtil.formatTime()}"`;
        },
      },
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new DatabaseExceptionFilter(),
    new WebSocketExceptionFilter(),
  );

  // 全局拦截器
  app.useGlobalInterceptors(new HttpReqTransformInterceptor());

  // 全局应用管道 对输入数据进行转换或者验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动排除DTO中未定义的属性
      forbidNonWhitelisted: false, // 如果存在非白名单属性，返回错误
      transform: true, // 自动将请求参数转换为相应的类型
    }),
  );

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // swagger配置
  const options = new DocumentBuilder()
    .setTitle('Himate接口文档')
    .setDescription('Himate api v2.0')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const documents = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, documents);

  //  fastify-cors配置
  await app.register(fastifyCors, {
    origin: ['http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-custom-lang'],
  });

  // 注册 fastify-multipart 插件
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 1000 * 1024 * 1024, // 1GB
    },
  });

  // 注册压缩的静态资源服务
  await app.register(fastifyStatic, {
    root: FILE_DIR.THUMBNAIL,
    serve: true,
    prefix: '/thumbnail',
    index: false,
  });

  // 运行的端口
  await app.listen(3000, '0.0.0.0');

  // 静态资源服务
  const staticApp = express();
  staticApp.use('/static', express.static(FILE_DIR.UPLOAD));
  staticApp.listen(3002);
}
bootstrap();
