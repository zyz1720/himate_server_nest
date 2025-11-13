import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateController } from './mate.controller';
import { MateService } from './mate.service';
import { MateEntity } from './entity/mate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MateEntity])],
  controllers: [MateController],
  providers: [MateService],
  exports: [MateService],
})
export class MateModule {}
