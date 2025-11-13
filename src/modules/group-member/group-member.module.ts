import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMemberController } from './group-member.controller';
import { GroupMemberService } from './group-member.service';
import { GroupMemberEntity } from './entity/group-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMemberEntity])],
  controllers: [GroupMemberController],
  providers: [GroupMemberService],
  exports: [GroupMemberService],
})
export class GroupMemberModule {}
