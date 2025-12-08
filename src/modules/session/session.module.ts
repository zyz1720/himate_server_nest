import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionEntity } from './entity/session.entity';
import { AppSessionController } from './app-session.controller';
import { MateModule } from '../mate/mate.module';
import { GroupModule } from '../group/group.module';
import { MessageModule } from '../message/message.module';
import { MessageReadRecordsModule } from '../message-read-records/message-read-records.module';
import { SseSessionController } from './sse-session.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    MateModule,
    GroupModule,
    MessageModule,
    MessageReadRecordsModule,
  ],
  controllers: [SessionController, AppSessionController, SseSessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
