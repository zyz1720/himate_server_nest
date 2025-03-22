import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileEntity } from 'src/entities/file.entity';
import { musicEntity } from 'src/entities/music.entity';
import { BullModule } from '@nestjs/bull';
import { fileParserConsumer } from 'src/core/bull/file-parser.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([fileEntity]),
    TypeOrmModule.forFeature([musicEntity]),
    BullModule.registerQueue({ name: 'fileParser' }),
  ],
  controllers: [FileController],
  providers: [fileParserConsumer, FileService],
  exports: [FileService],
})
export class FileModule {}
