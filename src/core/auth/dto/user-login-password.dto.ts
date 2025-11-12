import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UserLoginByPasswordDto {
  @ApiProperty({
    description: '账号/自定义账号',
    required: true,
  })
  @IsOptional()
  readonly account: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
