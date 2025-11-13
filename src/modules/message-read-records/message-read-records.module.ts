import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageReadRecordsController } from './message-read-records.controller';
import { MessageReadRecordsService } from './message-read-records.service';
import { MessageReadRecordsEntity } from './entity/message-read-records.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageReadRecordsEntity])],
  controllers: [MessageReadRecordsController],
  providers: [MessageReadRecordsService],
  exports: [MessageReadRecordsService],
})
export class MessageReadRecordsModule {}
