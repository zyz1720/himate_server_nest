import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsByteLength,
  IsOptional,
  Length,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { FindAllUserDto } from './find-all-user.dto';
import { DataLength } from 'src/common/constants/database-enum.const';

export class UpdateUserDto extends PickType(FindAllUserDto, [
  'user_name',
  'user_role',
  'sex',
  'user_status',
  'account',
  'self_account',
  'birthday',
] as const) {
  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly user_avatar?: string;

  @ApiProperty({ description: '新密码', required: false })
  @IsOptional()
  @Length(6, 18, { message: '密码长度为6-18位' })
  password?: string;
}

export class AppUpdateUserDto extends PickType(UpdateUserDto, [
  'self_account',
  'user_name',
  'user_avatar',
  'sex',
  'birthday',
] as const) {}

export class UpdateUserPasswordDto {
  @ApiProperty({ description: '新密码', required: false })
  @IsNotEmpty()
  @Length(6, 18)
  readonly password: string;

  @ApiProperty({ description: '旧密码', required: false })
  @IsNotEmpty()
  @Length(6, 18)
  readonly oldPassword: string;

  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty()
  @Length(6, 6)
  readonly code: string;
}

export class UpdateUserAccountDto {
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty()
  @IsEmail()
  @IsByteLength(0, DataLength.Medium)
  readonly newAccount: string;

  @ApiProperty({ description: '验证码', required: true })
  @IsNotEmpty()
  @Length(6, 6)
  readonly code: string;
}
