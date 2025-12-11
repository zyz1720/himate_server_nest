import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionEntity } from './entity/session.entity';
import { AppSessionController } from './app-session.controller';
import { MateModule } from '../mate/mate.module';
import { GroupModule } from '../group/group.module';
import { GroupMemberModule } from '../group-member/group-member.module';
import { MessageModule } from '../message/message.module';
import { MessageReadRecordsModule } from '../message-read-records/message-read-records.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    MateModule,
    GroupModule,
    GroupMemberModule,
    MessageModule,
    MessageReadRecordsModule,
  ],
  controllers: [SessionController, AppSessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
