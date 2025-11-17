import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicEntity } from './entity/music.entity';
import { AppMusicController } from './app-music.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MusicEntity])],
  controllers: [MusicController, AppMusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
