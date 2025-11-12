import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CaptchaController } from './captcha.controller';
import { RedisModule } from '../Redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [CaptchaService],
  controllers: [CaptchaController],
  exports: [CaptchaService],
})
export class CaptchaModule {}
