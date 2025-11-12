import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

// 邮箱号参数
export class EmailDto {
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: '图片验证码ID', required: true })
  @IsNotEmpty()
  readonly captchaId: string;

  @ApiProperty({ description: '图片验证码', required: true })
  @IsNotEmpty()
  readonly captchaCode: string;
}
