import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from './session.controller';
import { sessionEntity } from 'src/entities/session.entity';
import { MateModule } from '../mate/mate.module';
import { GroupModule } from '../group/group.module';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

@Module({
  imports: [TypeOrmModule.forFeature([sessionEntity]), MateModule, GroupModule],
  controllers: [SessionController],
  providers: [SessionService, QueryRunnerFactory],
  exports: [SessionService],
})
export class SessionModule {}
