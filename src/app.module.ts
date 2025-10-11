import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './core/auth/auth.module';
import { JwtAuthGuard } from './core/auth/guards/jwt.auth.guard';
import { RolesGuard } from './core/auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from './core/mail/mail.module';
import { RedisModule } from './core/Redis/redis.module';
import { MateModule } from './modules/mate/mate.module';
import { SessionModule } from './modules/session/session.module';
import { SocketModule } from './modules/socket/socket.module';
import { ChatModule } from './modules/chat/chat.module';
import { GroupModule } from './modules/group/group.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GroupMemberModule } from './modules/group-member/group-member.module';
import { UploadModule } from './core/upload/upload.module';
import { AppPackageModule } from './modules/app-package/app-package.module';
import { MusicModule } from './modules/music/music.module';
import { FileModule } from './modules/file/file.module';
import { BullModule } from '@nestjs/bull';
import { UserSubscriber } from './common/subscriber/user.subscriber';
import envConfig from '../config/env';
import { RequestContextModule } from 'nestjs-request-context';

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
        subscribers: [UserSubscriber], // 订阅者
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
    FileModule,
    RequestContextModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
