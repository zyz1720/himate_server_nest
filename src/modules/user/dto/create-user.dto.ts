import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
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
