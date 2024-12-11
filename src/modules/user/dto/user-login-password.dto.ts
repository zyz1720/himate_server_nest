import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UserLoginBypasswordDto {
  //ApiProperty是对数据类型的描述
  @ApiProperty({
    description: '邮箱号',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly account?: string;

  @ApiProperty({ description: '账号', required: false })
  @IsOptional()
  @MinLength(6, { message: '账号至少为6位' })
  readonly self_account?: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({ message: '缺少密码' })
  @MinLength(6, { message: '密码至少为6位' })
  @IsString()
  readonly password: string;
}
