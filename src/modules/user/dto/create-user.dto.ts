import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  Length,
  IsNotEmpty,
  IsByteLength,
} from 'class-validator';
import { DataLength } from 'src/commom/constants/base-enum.const';

export class CreateUserDto {
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsByteLength(0, DataLength.Medium)
  readonly account: string;

  @ApiProperty({ description: '密码', required: false })
  @IsOptional()
  @Length(6, 18, { message: '密码长度为6-18位' })
  password?: string;
}

export class RegisterUserDto extends CreateUserDto {
  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty({ message: '请输入验证码' })
  @Length(6, 6, { message: '验证码为6位' })
  @IsString()
  readonly code: string;
}
