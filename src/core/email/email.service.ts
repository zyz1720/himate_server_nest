import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../Redis/redis.service';
import { StringUtil } from 'src/common/utils/string.util';
import { Response } from 'src/common/response/api-response';
import { EmailDto } from './dto/email.dto';
import { CaptchaService } from '../captcha/captcha.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class EmailService {
  private transporter: nodeMailer.Transporter;
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly captchaService: CaptchaService,
    private readonly i18n: I18nService,
  ) {
    this.transporter = nodeMailer.createTransport({
      host: this.configService.get('MAil_HOST'),
      port: this.configService.get('MAil_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('MAil_USER'),
        pass: this.configService.get('MAil_PASSWORD'),
      },
    });
  }

  /**
   * 发送验证码
   */
  async sendCodeEmail(account: string, code: string) {
    try {
      const mailInfo = {
        to: account,
        subject: 'Himate验证服务',
        html: `<div style="background-color: white; border-radius: 8px; border: 1px solid #f5f5f5;">
        <div style="border-bottom: 1px solid #f5f5f5; padding: 12px;">
            <div style="font-size: 24px; font-weight: bold;">欢迎使用Himate!</div>
        </div>
        <div style="padding: 12px 0px;">
            <div style="text-align: center; margin-bottom: 12px;">您的验证码为</div>
            <div style="display: flex; justify-content: center; margin-bottom: 12px;">
                <div
                    style="font-size: 24px; color: #4848FF; font-weight: bold; text-align: center; padding: 8px; border-radius: 8px; background-color: #4848ff15;">
                    ${code}</div>
            </div>
            <div style="text-align: center; font-size: 12px;">请在<span style="color: #4096ff; ">10分钟</span>内完成操作，如非本人操作，请忽略！</div>
        </div>
    </div>`,
      };

      const info = await this.transporter.sendMail({
        from: this.configService.get('MAil_USER'), //发送方邮箱
        ...mailInfo,
      });
      return info;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * 发送用户验证码
   */
  async seedUserCode(query: EmailDto) {
    const { email, captchaId, captchaCode } = query || {};
    const captchaRes = await this.captchaService.validateCaptcha(
      captchaId,
      captchaCode,
    );
    if (!captchaRes) {
      await this.redisService.delValue(captchaId);
      return Response.fail(this.i18n.t('message.VALIDATE_FAILED'));
    }
    const code = StringUtil.createRandomNumber();
    await this.redisService.setValue(email + 'code', code, 600);
    const info = await this.sendCodeEmail(email, code);
    if (info) {
      await this.redisService.delValue(captchaId);
      return Response.ok(this.i18n.t('message.SEND_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.SEND_FAILED'));
    }
  }
}
