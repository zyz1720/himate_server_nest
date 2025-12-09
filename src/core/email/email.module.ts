import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { RedisModule } from '../redis/redis.module';
import { CaptchaModule } from '../captcha/captcha.module';

@Module({
  imports: [RedisModule, CaptchaModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
