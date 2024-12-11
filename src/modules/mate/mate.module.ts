import { Module } from '@nestjs/common';
import { MateService } from './mate.service';
import { MateController } from './mate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mateEntity } from 'src/entities/mate.entity';
import { UserModule } from '../user/user.module';
import { UserAvatarUpdatedListener } from './listeners/user_avatar.update.listener';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

@Module({
  imports: [TypeOrmModule.forFeature([mateEntity]), UserModule],
  controllers: [MateController],
  providers: [MateService, UserAvatarUpdatedListener, QueryRunnerFactory],
  exports: [MateService],
})
export class MateModule {}
