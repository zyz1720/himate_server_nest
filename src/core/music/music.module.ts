import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController, FavoritesController } from './music.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { musicEntity } from './entities/music.entity';
import { favoritesEntity } from './entities/favorites.entity';
import { UserModule } from 'src/modules/user/user.module';
import { UserInfoUpdatedListener } from './listeners/userInfo-update.listener';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([musicEntity, favoritesEntity]),
    UserModule,
  ],
  controllers: [MusicController, FavoritesController],
  providers: [MusicService, UserInfoUpdatedListener, QueryRunnerFactory],
  exports: [MusicService],
})
export class MusicModule {}
