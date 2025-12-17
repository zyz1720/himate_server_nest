import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginByPasswordDto {
  @ApiProperty({
    description: '账号/自定义账号',
    required: true,
  })
  @IsNotEmpty()
  readonly account: string;

  @ApiProperty({ description: '密码', required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
