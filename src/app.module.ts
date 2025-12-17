import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './core/auth/auth.module';
import { JwtAuthGuard } from './core/auth/guards/jwt.auth.guard';
import { RolesGuard } from './core/auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { EmailModule } from './core/email/email.module';
import { RedisModule } from './core/redis/redis.module';
import { UploadModule } from './core/upload/upload.module';
import { CaptchaModule } from './core/captcha/captcha.module';
import { MusicApiModule } from './core/music-api/music-api.module';
import { SocketModule } from './core/socket/socket.module';
import { SseModule } from './core/sse/sse.module';
import { AppPackageModule } from './modules/app-package/app-package.module';
import { SessionModule } from './modules/session/session.module';
import { MateModule } from './modules/mate/mate.module';
import { GroupModule } from './modules/group/group.module';
import { GroupMemberModule } from './modules/group-member/group-member.module';
import { MessageModule } from './modules/message/message.module';
import { MessageReadRecordsModule } from './modules/message-read-records/message-read-records.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { MusicModule } from './modules/music/music.module';
import { MusicExtraModule } from './modules/music-extra/music-extra.module';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { UserSubscriber } from './common/subscriber/user.subscriber';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import { join } from 'path';
import { Redis } from 'ioredis';
import envConfig from '../config/env';

@Module({
  imports: [
    // 环境配置
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),

    // 国际化配置
    I18nModule.forRoot({
      fallbackLanguage: 'zh',
      loaderOptions: {
        path: join(__dirname, '../', '/i18n/'),
        watch: true,
      },
      disableMiddleware: true,
      resolvers: [
        { use: HeaderResolver, options: ['x-custom-lang'] },
        AcceptLanguageResolver,
      ],
    }),

    // 限流配置
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          throttlers: [
            {
              ttl: configService.get<number>('THROTTLE_TTL'), // 毫秒
              limit: configService.get<number>('THROTTLE_LIMIT'),
            },
          ],
          storage: new ThrottlerStorageRedisService(
            new Redis({
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
              password: configService.get<string>('REDIS_PASSWORD'),
            }),
          ),
        };
      },
    }),

    // 数据库配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
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
        charset: 'utf8mb4_unicode_ci',
        extra: {
          engine: 'InnoDB', // 指定数据库引擎
        },
      }),
    }),

    // 事件配置
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),

    // 队列配置
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),

    AuthModule,
    EmailModule,
    CaptchaModule,
    UploadModule,
    UserModule,
    RedisModule,
    SseModule,
    SocketModule,
    MusicApiModule,
    AppPackageModule,
    SessionModule,
    MateModule,
    GroupModule,
    GroupMemberModule,
    MessageModule,
    MessageReadRecordsModule,
    FavoritesModule,
    MusicModule,
    MusicExtraModule,
    FileModule,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
