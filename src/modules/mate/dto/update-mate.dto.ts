import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsByteLength, IsEnum } from 'class-validator';
import { MateStatusEnum } from '../entity/mate.entity';
import { DataLength } from 'src/common/constants/database-enum.const';

export class UpdateMateDto {
  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  readonly user_id?: number;

  @ApiPropertyOptional({ description: '好友对用户的备注' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly user_remarks?: string;

  @ApiPropertyOptional({ description: '好友id' })
  @IsOptional()
  readonly friend_id?: number;

  @ApiPropertyOptional({ description: '用户对好友的备注' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly friend_remarks?: string;

  @ApiPropertyOptional({ description: '好友状态', default: 'waiting' })
  @IsOptional()
  @IsEnum(MateStatusEnum)
  readonly mate_status?: MateStatusEnum;

  @ApiPropertyOptional({ description: '验证消息' })
  @IsOptional()
  @IsByteLength(0, DataLength.Longer)
  readonly validate_msg?: string;
}
