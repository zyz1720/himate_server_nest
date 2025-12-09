import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { AuthModule } from 'src/core/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'src/core/redis/redis.module';
import { AppUserController } from './app-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule), // 处理相互循环依赖
    PassportModule,
    RedisModule,
  ],
  controllers: [UserController, AppUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
