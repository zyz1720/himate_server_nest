import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsByteLength,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { MateStatusEnum } from '../entity/mate.entity';

export class AddMateDto {
  @ApiProperty({ description: '好友uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  readonly mate_id: string;

  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty()
  readonly user_id: number;

  @ApiProperty({ description: '好友对用户的备注', required: false })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly user_remarks?: string;

  @ApiProperty({ description: '好友id', required: true })
  @IsNotEmpty()
  readonly friend_id: number;

  @ApiProperty({ description: '用户对好友的备注', required: false })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly friend_remarks?: string;

  @ApiProperty({ description: '好友状态', required: true, default: 'waiting' })
  @IsNotEmpty()
  @IsEnum(MateStatusEnum)
  readonly mate_status: MateStatusEnum;

  @ApiProperty({ description: '验证消息', required: false })
  @IsOptional()
  @IsByteLength(0, 240)
  readonly validate_msg?: string;
}
