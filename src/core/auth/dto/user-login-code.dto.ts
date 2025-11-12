import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class UserLoginByCodeDto {
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly account: string;

  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty()
  @Length(6, 6)
  @IsString()
  readonly code: string;
}
