import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './src/commom/filters/exception';
import { HttpReqTransformInterceptor } from './src/commom/interceptor/http-req.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { BaseConst } from 'src/commom/constants/base.const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionFilter());

  // 全局拦截器
  app.useGlobalInterceptors(new HttpReqTransformInterceptor());

  // 全局应用管道 对输入数据进行转换或者验证
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // 排除dto中不存在的字段
      forbidNonWhitelisted: true, // 禁止非白名单字段的输入
    }),
  );

  app.enableCors({
    origin: ['http://localhost:8080', 'http://192.168.110.35'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

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

  // 运行的端口
  await app.listen(3000);

  const staticApp = express();
  staticApp.use('/static', express.static(BaseConst.uploadDir));
  staticApp.listen(3002);
}
bootstrap();
