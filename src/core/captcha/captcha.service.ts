import { Injectable } from '@nestjs/common';
import { RedisService } from '../Redis/redis.service';
import { StringUtil } from 'src/common/utils/string.util';
import { Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { CaptchaResultDto } from './dto/captcha.dto';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  constructor(
    private readonly redisService: RedisService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * 生成图片验证码
   * @returns 验证码ID和图片Base64数据
   */
  async generateCaptcha() {
    try {
      const captcha = svgCaptcha.create();
      const captchaId = StringUtil.createUUID();
      await this.redisService.setValue(captchaId, captcha.text, 60);
      return Response.ok(
        this.i18n.t('message.GET_SUCCESS'),
        new CaptchaResultDto(captchaId, captcha.data),
      );
    } catch (error) {
      console.error(error);
      return Response.fail(this.i18n.t('message.GET_FAILED'));
    }
  }

  /**
   * 验证验证码
   * @param captchaId 验证码ID
   * @param code 用户输入的验证码
   * @returns 验证结果
   */
  async validateCaptcha(captchaId: string, code: string) {
    // 从Redis获取验证码
    const storedCode = await this.redisService.getValue(captchaId);
    if (!storedCode) {
      return false;
    }
    await this.redisService.delValue(captchaId);
    return storedCode.toLowerCase() === code.toLowerCase();
  }
}
