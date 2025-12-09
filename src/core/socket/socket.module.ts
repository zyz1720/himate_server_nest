import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SessionModule } from 'src/modules/session/session.module';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [SessionModule, AuthModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
