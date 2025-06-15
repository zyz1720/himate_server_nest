import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

export class UserLoginBypasswordDto {
  @ApiProperty({
    description: '邮箱号',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly account?: string;

  @ApiProperty({ description: '账号', required: false })
  @IsOptional()
  readonly self_account?: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty({ message: '缺少密码' })
  @IsString()
  readonly password: string;
}
