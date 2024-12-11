import { Module } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { GroupMemberController } from './group-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { groupMemberEntity } from 'src/entities/group-member.entity';
import { AvatarUpdatedListener } from './listeners/avatar-update.listener';
import { GroupDeletedListener } from './listeners/group-deleted.listener';
import { UserModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([groupMemberEntity]),
    UserModule,
    GroupModule,
  ],
  controllers: [GroupMemberController],
  providers: [
    GroupMemberService,
    AvatarUpdatedListener,
    GroupDeletedListener,
    QueryRunnerFactory,
  ],
  exports: [GroupMemberService],
})
export class GroupMemberModule {}
