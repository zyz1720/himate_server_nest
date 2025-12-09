import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SessionModule } from 'src/modules/session/session.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { RedisModule } from 'src/core/redis/redis.module';

@Module({
  imports: [SessionModule, AuthModule, RedisModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
