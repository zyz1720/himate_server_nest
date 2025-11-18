import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SessionModule } from '../session/session.module';
import { MateModule } from '../mate/mate.module';
import { GroupModule } from '../group/group.module';
import { MessageModule } from '../message/message.module';
import { MessageReadRecordsModule } from '../message-read-records/message-read-records.module';

@Module({
  imports: [
    SessionModule,
    MateModule,
    GroupModule,
    MessageModule,
    MessageReadRecordsModule,
  ],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
