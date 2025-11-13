import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsByteLength, IsEnum, IsUUID } from 'class-validator';
import { MateStatusEnum } from '../entity/mate.entity';

export class UpdateMateDto {
  @ApiPropertyOptional({ description: '好友uuid' })
  @IsOptional()
  @IsUUID()
  readonly mate_id?: string;

  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  readonly user_id?: number;

  @ApiPropertyOptional({ description: '好友对用户的备注' })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly user_remarks?: string;

  @ApiPropertyOptional({ description: '好友id' })
  @IsOptional()
  readonly friend_id?: number;

  @ApiPropertyOptional({ description: '用户对好友的备注' })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly friend_remarks?: string;

  @ApiPropertyOptional({ description: '好友状态', default: 'waiting' })
  @IsOptional()
  @IsEnum(MateStatusEnum)
  readonly mate_status?: MateStatusEnum;

  @ApiPropertyOptional({ description: '验证消息' })
  @IsOptional()
  @IsByteLength(0, 240)
  readonly validate_msg?: string;
}
