import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class UserLoginByCodeDto {
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly account: string;

  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty()
  @Length(6, 6)
  readonly code: string;
}
