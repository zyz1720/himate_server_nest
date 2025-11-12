import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, IsNotEmpty, IsByteLength } from 'class-validator';
import { DataLength } from 'src/common/constants/database-enum.const';

export class CreateUserDto {
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty()
  @IsEmail()
  @IsByteLength(0, DataLength.Medium)
  readonly account: string;

  @ApiProperty({ description: '密码', required: false })
  @IsNotEmpty()
  @Length(6, 18)
  password: string;
}

export class RegisterUserDto extends CreateUserDto {
  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty()
  @Length(6, 6)
  readonly code: string;
}
