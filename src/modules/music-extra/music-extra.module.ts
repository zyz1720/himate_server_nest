import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicExtraController } from './music-extra.controller';
import { MusicExtraService } from './music-extra.service';
import { MusicExtraEntity } from './entity/music-extra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MusicExtraEntity])],
  controllers: [MusicExtraController],
  providers: [MusicExtraService],
  exports: [MusicExtraService],
})
export class MusicExtraModule {}
