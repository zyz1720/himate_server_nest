import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SessionModule } from 'src/modules/session/session.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { RedisModule } from 'src/core/redis/redis.module';
import { SseModule } from 'src/core/sse/sse.module';
import { GroupMessageListener } from './listeners/group-message.listener';

@Module({
  imports: [SessionModule, AuthModule, RedisModule, SseModule],
  providers: [SocketGateway, SocketService, GroupMessageListener],
  exports: [SocketService],
})
export class SocketModule {}
