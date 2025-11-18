import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateController } from './mate.controller';
import { MateService } from './mate.service';
import { MateEntity } from './entity/mate.entity';
import { UserModule } from '../user/user.module';
import { AppMateController } from './app-mate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MateEntity]), UserModule],
  controllers: [MateController, AppMateController],
  providers: [MateService],
  exports: [MateService],
})
export class MateModule {}
