import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsByteLength } from 'class-validator';
import { DataLength } from 'src/common/constants/database-enum.const';

export class UpdateGroupDto {
  @ApiPropertyOptional({ description: '群组名称' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly group_name?: string;

  @ApiPropertyOptional({ description: '群组头像' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly group_avatar?: string;

  @ApiPropertyOptional({ description: '群组简介' })
  @IsOptional()
  readonly group_introduce?: string;
}
