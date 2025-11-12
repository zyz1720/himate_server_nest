import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

// 图片验证码
export class CaptchaResultDto {
  constructor(id: string, img: string) {
    this.captcha_id = id;
    this.captcha_img = img;
  }

  @ApiProperty({ description: '图片验证码ID', required: true })
  @IsNotEmpty()
  readonly captcha_id: string;

  @ApiProperty({ description: '图片验证码', required: true })
  @IsNotEmpty()
  readonly captcha_img: string;
}
