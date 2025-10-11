import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../Redis/redis.service';
import { createRandomNumber } from '../../common/utils/base';
import { ResultMsg } from 'src/common/utils/result';
import { AccountDto } from 'src/common/dto/common.dto';

@Injectable()
export class MailService {
  private transporter: nodeMailer.Transporter;
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.transporter = nodeMailer.createTransport({
      host: this.configService.get('MAil_HOST'),
      port: 465,
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
        subject: '验证服务<Himate>',
        html: `<div style="background-color: white; border-radius: 4px; border: 1px solid #e4e6eb; padding: 0px 10px; box-shadow: 0px 0px 10px 1px #e4e6eb;">
      <div style="border-bottom: 1px solid #e4e6eb; padding: 12px 0px 8px 0px;">
          <h1>欢迎使用Himate!</h1>
      </div>
      <p>您的验证码为<span style="font-size: 22px; color: #4848FF; font-weight: bold;">${code}</span>，请在<span style="color: #F56C6C; ">10分钟</span>内完成操作，如非本人操作，请忽略！</p>
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
  async seedUserCode(query: AccountDto) {
    const { account } = query || {};
    const code = createRandomNumber();
    this.redisService.setValue(account + 'code', code, 600);
    const info = await this.sendCodeEmail(account, code);
    if (info) {
      return ResultMsg.ok('验证码发送成功！');
    } else {
      return ResultMsg.fail('验证码发送失败！');
    }
  }
}
