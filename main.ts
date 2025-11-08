import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './src/common/filters/exception';
import { HttpReqTransformInterceptor } from './src/common/interceptor/http-req.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { BaseConst } from 'src/common/constants/base.const';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        timestamp: () => `,"time":"${new Date().toLocaleString()}"`,
      },
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionFilter());

  // 全局拦截器
  app.useGlobalInterceptors(new HttpReqTransformInterceptor());

  // 全局应用管道 对输入数据进行转换或者验证
  app.useGlobalPipes(new ValidationPipe());

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // sawgger配置
  const options = new DocumentBuilder()
    .setTitle('Himate接口文档')
    .setDescription('Himate api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documents = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, documents);

  //  fastify-cors配置
  await app.register(fastifyCors, {
    origin: ['http://localhost:8080', 'http://192.168.110.35'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 注册 fastify-multipart 插件
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 1000 * 1024 * 1024, // 1GB
    },
  });

  // 注册压缩的静态资源服务
  await app.register(fastifyStatic, {
    root: BaseConst.ThumbnailDir,
    serve: true,
    prefix: '/Thumbnail',
    index: false,
  });

  // 运行的端口
  await app.listen(3000, '0.0.0.0');

  // 静态资源服务
  const staticApp = express();
  staticApp.use('/static', express.static(BaseConst.uploadDir));
  staticApp.listen(3002);
}
bootstrap();
