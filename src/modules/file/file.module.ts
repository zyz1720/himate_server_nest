import { forwardRef, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileEntity } from 'src/entities/file.entity';
import { BullModule } from '@nestjs/bull';
import { fileHandleConsumer } from 'src/commom/bull/file-handle.consumer';
import { MusicModule } from '../music/music.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([fileEntity]),
    forwardRef(() => MusicModule),
    BullModule.registerQueue({ name: 'fileHandle' }),
  ],
  controllers: [FileController],
  providers: [fileHandleConsumer, FileService],
  exports: [FileService],
})
export class FileModule {}
