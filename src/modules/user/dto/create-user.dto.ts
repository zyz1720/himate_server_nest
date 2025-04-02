import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  //ApiProperty是对数据类型的描述
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsString()
  readonly account: string;

  @ApiProperty({ description: '密码', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: '密码至少为6位' })
  password?: string;
}

export class RegisterUserDto extends CreateUserDto {
  //ApiProperty是对数据类型的描述
  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty({ message: '请输入验证码' })
  @Length(6, 6, { message: '验证码为6位' })
  @IsString()
  readonly code: string;
}
