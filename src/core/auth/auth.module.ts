import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/modules/user/user.module';
import { AuthController } from './auth.controller';
import { WsJwtAuthGuard } from './guards/ws-jwt.auth.guard';
import { WsThrottlerGuard } from './guards/ws-throttler.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    forwardRef(() => UserModule),
    PassportModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    WsJwtAuthGuard,
    WsThrottlerGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService, WsJwtAuthGuard, WsThrottlerGuard],
})
export class AuthModule {}
