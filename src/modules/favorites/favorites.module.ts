import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { AppFavoritesController } from './app-favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoritesEntity } from './entity/favorites.entity';
import { MusicModule } from '../music/music.module';

@Module({
  imports: [TypeOrmModule.forFeature([FavoritesEntity]), MusicModule],
  controllers: [FavoritesController, AppFavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
