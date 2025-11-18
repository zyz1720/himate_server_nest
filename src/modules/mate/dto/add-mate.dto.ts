import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsByteLength, IsEnum } from 'class-validator';
import { MateStatusEnum } from '../entity/mate.entity';
import { DataLength } from 'src/common/constants/database-enum.const';

export class AddMateDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty()
  readonly user_id: number;

  @ApiProperty({ description: '好友对用户的备注', required: false })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly user_remarks?: string;

  @ApiProperty({ description: '好友id', required: true })
  @IsNotEmpty()
  readonly friend_id: number;

  @ApiProperty({ description: '用户对好友的备注', required: false })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly friend_remarks?: string;

  @ApiProperty({ description: '好友状态', required: true, default: 'waiting' })
  @IsNotEmpty()
  @IsEnum(MateStatusEnum)
  readonly mate_status: MateStatusEnum;

  @ApiProperty({ description: '验证消息', required: false })
  @IsOptional()
  @IsByteLength(0, DataLength.Longer)
  readonly validate_msg?: string;
}

export class AddUserMateDto extends PickType(AddMateDto, [
  'friend_id',
  'friend_remarks',
  'validate_msg',
]) {}
