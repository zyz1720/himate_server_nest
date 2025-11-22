import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageEntity } from './entity/message.entity';
import { AppMessageController } from './app-message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  controllers: [MessageController, AppMessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
