import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionEntity } from './entity/session.entity';
import { AppSessionController } from './app-session.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  controllers: [SessionController, AppSessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
