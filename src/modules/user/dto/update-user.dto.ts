import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsByteLength,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
} from 'class-validator';
import { FindAllUserDto } from './findall-user.dto';
import { DataLength } from 'src/common/constants/base-enum.const';

export class UpdateUserDto extends PickType(FindAllUserDto, [
  'user_name',
  'user_role',
  'sex',
  'user_status',
  'account',
  'self_account',
] as const) {
  @ApiProperty({ description: 'id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  @IsNumber()
  readonly id: number;

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly user_avatar?: string;

  @ApiProperty({ description: '新密码', required: false })
  @IsOptional()
  @Length(6, 18, { message: '密码长度为6-18位' })
  readonly password?: string;

  @ApiProperty({ description: '旧密码', required: false })
  @IsOptional()
  @Length(6, 18, { message: '密码长度为6-18位' })
  readonly oldpassword?: string;

  @ApiProperty({
    description: '生日',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly birthday?: string;
}
