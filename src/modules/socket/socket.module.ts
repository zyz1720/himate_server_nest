import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SessionModule } from '../session/session.module';
import { ChatModule } from '../chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { sessionEntity } from 'src/entities/session.entity';
import { chatEntity } from 'src/entities/chat.entity';
import { RedisModule } from 'src/core/Redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([chatEntity, sessionEntity]),
    SessionModule,
    RedisModule,
    ChatModule,
  ],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
