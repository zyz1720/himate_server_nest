import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './src/commom/filters/exception';
import { HttpReqTransformInterceptor } from './src/commom/interceptor/http-req.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { BaseConst } from 'src/commom/constants/base.const';

async function myAppSever() {
  const app = await NestFactory.create(AppModule);

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

  // 运行的端口
  await app.listen(3000);

  const staticApp = express();
  staticApp.use('/static', express.static(BaseConst.uploadDir));
  staticApp.listen(3002);
}
myAppSever();
