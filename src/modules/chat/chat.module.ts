import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { chatEntity } from 'src/entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from '../session/session.module';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

@Module({
  imports: [TypeOrmModule.forFeature([chatEntity]), SessionModule],
  controllers: [ChatController],
  providers: [ChatService, QueryRunnerFactory],
  exports: [ChatService],
})
export class ChatModule {}
