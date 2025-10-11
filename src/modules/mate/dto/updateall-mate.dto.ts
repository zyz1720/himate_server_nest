import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsByteLength, IsOptional } from 'class-validator';
import { UpdateMateDto } from './update-mate.dto';
import { DataLength } from 'src/common/constants/base-enum.const';

export class UpdateAllMateDto extends PickType(UpdateMateDto, [
  'id',
  'mate_status',
  'validate_msg',
] as const) {
  @ApiPropertyOptional({ description: '申请备注' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly apply_remark?: string;

  @ApiPropertyOptional({ description: '同意备注' })
  @IsByteLength(0, DataLength.Medium)
  @IsOptional()
  readonly agree_remark?: string;

  @ApiPropertyOptional({ description: '申请人头像' })
  @IsByteLength(0, DataLength.Long)
  @IsOptional()
  readonly apply_avatar?: string;

  @ApiPropertyOptional({ description: '同意人头像' })
  @IsByteLength(0, DataLength.Long)
  @IsOptional()
  readonly agree_avatar?: string;
}
