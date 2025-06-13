import { forwardRef, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileEntity } from 'src/entities/file.entity';
import { BullModule } from '@nestjs/bull';
import { FileParserConsumer } from 'src/commom/bull/file-parser.consumer';
import { MusicModule } from '../music/music.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([fileEntity]),
    forwardRef(() => MusicModule),
    BullModule.registerQueue({ name: 'fileParser' }),
  ],
  controllers: [FileController],
  providers: [FileParserConsumer, FileService],
  exports: [FileService],
})
export class FileModule {}
