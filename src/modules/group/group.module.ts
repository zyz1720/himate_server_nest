import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupEntity } from './entity/group.entity';
import { AppGroupController } from './app-group.controller';
import { GroupMemberModule } from '../group-member/group-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity]),
    forwardRef(() => GroupMemberModule),
  ],
  controllers: [GroupController, AppGroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
