import { Module } from '@nestjs/common';
import { MusicApiService } from './music-api.service';
import { MusicApiController } from './music-api.controller';
import { MusicExtraModule } from 'src/modules/music-extra/music-extra.module';
import { MusicModule } from 'src/modules/music/music.module';
import { FileModule } from 'src/modules/file/file.module';

@Module({
  imports: [MusicExtraModule, FileModule, MusicModule],
  controllers: [MusicApiController],
  providers: [MusicApiService],
  exports: [MusicApiService],
})
export class MusicApiModule {}
