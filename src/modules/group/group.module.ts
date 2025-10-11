import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { groupEntity } from 'src/entities/group.entity';
import { UserModule } from '../user/user.module';
import { QueryRunnerFactory } from 'src/common/factories/query-runner.factory';

@Module({
  imports: [TypeOrmModule.forFeature([groupEntity]), UserModule],
  controllers: [GroupController],
  providers: [GroupService, QueryRunnerFactory],
  exports: [GroupService],
})
export class GroupModule {}
