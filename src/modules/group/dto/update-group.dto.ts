import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsByteLength,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
} from 'class-validator';
import {
  DataLength,
  MemberStatus as GroupStatus,
} from 'src/common/constants/base-enum.const';

export class UpdateGroupDto {
  @ApiProperty({ description: '群组自增id', required: true })
  @IsNotEmpty({ message: '缺少群自增id' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly id: number;

  @ApiPropertyOptional({ description: '群名' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly group_name?: string;

  @ApiPropertyOptional({ description: '群头像' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly group_avatar?: string;

  @ApiPropertyOptional({ description: '群组简介' })
  @IsOptional()
  readonly group_introduce?: string;

  @ApiPropertyOptional({
    description: '群状态',
    enum: GroupStatus,
  })
  @IsOptional()
  @IsEnum(GroupStatus)
  readonly group_status?: GroupStatus;
}
