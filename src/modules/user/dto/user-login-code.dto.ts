import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class UserLoginBycodeDto {
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty({ message: '缺少邮箱号' })
  @IsString()
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly account: string;

  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty({ message: '缺少验证码' })
  @Length(6, 6, { message: '验证码为6位' })
  @IsString()
  readonly code: string;
}
