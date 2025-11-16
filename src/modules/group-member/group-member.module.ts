import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMemberController } from './group-member.controller';
import { GroupMemberService } from './group-member.service';
import { GroupMemberEntity } from './entity/group-member.entity';
import { AppGroupMemberController } from './app-group-member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMemberEntity])],
  controllers: [GroupMemberController, AppGroupMemberController],
  providers: [GroupMemberService],
  exports: [GroupMemberService],
})
export class GroupMemberModule {}
