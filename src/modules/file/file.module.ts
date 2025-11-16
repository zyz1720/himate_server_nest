import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileEntity } from './entity/file.entity';
import { BullModule } from '@nestjs/bull';
import { FileQueueConsumer } from 'src/common/bull/file-queue.consumer';
import { MusicModule } from '../music/music.module';
import { AppFileController } from './app-file.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    forwardRef(() => MusicModule),
    BullModule.registerQueue({ name: 'file_queue' }),
  ],
  controllers: [FileController, AppFileController],
  providers: [FileService, FileQueueConsumer],
  exports: [FileService],
})
export class FileModule {}
