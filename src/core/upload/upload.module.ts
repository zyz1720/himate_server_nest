import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileEntity } from 'src/core/upload/entities/file.entity';
import { BullModule } from '@nestjs/bull';
import { fileParserConsumer } from '../bull/file-parser.consumer';
import { musicEntity } from '../music/entities/music.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([fileEntity]),
    TypeOrmModule.forFeature([musicEntity]),
    BullModule.registerQueue({ name: 'fileParser' }),
  ],
  controllers: [UploadController],
  providers: [fileParserConsumer, UploadService],
  exports: [UploadService],
})
export class UploadModule {}
