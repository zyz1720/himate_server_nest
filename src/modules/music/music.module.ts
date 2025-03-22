import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import {
  MusicController,
  FavoritesController,
  musicMoreController,
} from './music.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { musicEntity } from 'src/entities/music.entity';
import { favoritesEntity } from 'src/entities/favorites.entity';
import { musicMoreEntity } from 'src/entities/music-more.entity';
import { UserModule } from 'src/modules/user/user.module';
import { UserInfoUpdatedListener } from './listeners/userInfo-update.listener';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([musicEntity, favoritesEntity, musicMoreEntity]),
    UserModule,
    FileModule,
  ],
  controllers: [MusicController, FavoritesController, musicMoreController],
  providers: [MusicService, UserInfoUpdatedListener, QueryRunnerFactory],
  exports: [MusicService],
})
export class MusicModule {}
