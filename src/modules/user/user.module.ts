import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from './entity/user.entity';
import { AuthModule } from 'src/core/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'src/core/Redis/redis.module';
import { QueryRunnerFactory } from 'src/common/factories/query-runner.factory';
import { AppUserController } from './user-app.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([userEntity]),
    forwardRef(() => AuthModule), // 处理相互循环依赖
    PassportModule,
    RedisModule,
  ],
  controllers: [UserController, AppUserController],
  providers: [UserService, QueryRunnerFactory],
  exports: [UserService],
})
export class UserModule {}
