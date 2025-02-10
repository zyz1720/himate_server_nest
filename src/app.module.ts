import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './core/auth/auth.module';
import { JwtAuthGuard } from './core/auth/jwt.auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from './core/mail/mail.module';
import { RedisModule } from './core/Redis/redis.module';
import { MulterModule } from '@nestjs/platform-express';
import { CorsMiddleware } from './commom/CorsMiddleware/cors.middleware';
import { diskStorage } from 'multer';
import { MateModule } from './modules/mate/mate.module';
import { SessionModule } from './modules/session/session.module';
import { SocketModule } from './modules/socket/socket.module';
import { ChatModule } from './modules/chat/chat.module';
import { GroupModule } from './modules/group/group.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GroupMemberModule } from './modules/group-member/group-member.module';
import { UploadModule } from './core/upload/upload.module';
import { AppPackageModule } from './modules/app-package/app-package.module';
import { UploadController } from './core/upload/upload.controller';
import { MusicModule } from './core/music/music.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BaseConst } from './commom/constants/base.const';
import { BullModule } from '@nestjs/bull';
import envConfig from '../config/env';

@Module({
  imports: [
    // 环境配置
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),

    // 数据库配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // 数据表实体
        host: configService.get('DB_HOST'), // 主机
        port: configService.get<number>('DB_PORT'), // 端口号
        username: configService.get('DB_USER'), // 用户名
        password: configService.get('DB_PASSWORD'), // 密码
        database: configService.get('DB_DATABASE'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
        // cache: true, // 缓存连接池，默认30秒
        charset: 'utf8mb4',
        extra: {
          engine: 'InnoDB', // 指定数据库引擎
        },
      }),
    }),

    // 文件上传配置
    MulterModule.register({
      storage: diskStorage({
        // 指定文件存储目录
        destination: BaseConst.uploadDir,
        filename: (_, file, callback) => {
          const fileName = Buffer.from(file.originalname, 'latin1').toString(
            'utf8',
          );
          return callback(null, fileName);
        },
      }),
    }),

    // 压缩后的静态资源配置
    ServeStaticModule.forRoot({
      rootPath: BaseConst.ThumbnailDir,
      serveRoot: '/Thumbnail',
      serveStaticOptions: {
        index: false,
      },
    }),

    // 事件配置
    EventEmitterModule.forRoot({
      wildcard: false, // 将其设置为“true”以使用通配符
      delimiter: '.', // 用于对命名空间进行分段的分隔符
      newListener: false, // 如果要发出newListener事件，请将其设置为“true”
      removeListener: false, // 如果要发出removeListener事件，请将其设置为“true”
      maxListeners: 10, // 可以分配给事件的最大侦听器数量
      verboseMemoryLeak: false, // 当分配的侦听器数量超过最大值时，在内存泄漏消息中显示事件名称
      ignoreErrors: false, // 如果发出错误事件并且没有侦听器，则禁用抛出uncaughtException
    }),

    // 队列配置
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),

    UploadModule,
    UserModule,
    AuthModule,
    MailModule,
    RedisModule,
    MateModule,
    SessionModule,
    SocketModule,
    ChatModule,
    GroupModule,
    GroupMemberModule,
    AppPackageModule,
    MusicModule,
  ],
  // 此处必须添加'UploadController',否则上传配置无法生效
  controllers: [AppController, UploadController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*'); // 设置需要应用中间件的路由路径，此处为所有路由
  }
}
