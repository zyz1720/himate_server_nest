import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';
import { MateStatus } from 'src/common/constants/base-enum.const';

export class FindAllMateDto extends PickType(FindAllDto, [
  'pageNum',
  'pageSize',
  'isPaging',
] as const) {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  readonly uid: number;

  @ApiPropertyOptional({
    description: '好友状态',
    enum: MateStatus,
  })
  @IsEnum(MateStatus)
  @IsOptional()
  readonly mate_status?: MateStatus;
}

export class FindAllMatelistDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '好友关系id' })
  @IsOptional()
  readonly id?: number;

  @ApiPropertyOptional({ description: '好友关系uuid' })
  @IsOptional()
  readonly mate_id?: string;

  @ApiPropertyOptional({ description: '申请人id' })
  @IsOptional()
  readonly apply_uid?: number;

  @ApiPropertyOptional({ description: '同意人id' })
  @IsOptional()
  readonly agree_uid?: number;

  @ApiPropertyOptional({ description: '申请备注' })
  @IsOptional()
  readonly apply_remark?: string;

  @ApiPropertyOptional({ description: '同意备注' })
  @IsOptional()
  readonly agree_remark?: string;

  @ApiPropertyOptional({ description: '验证消息' })
  @IsOptional()
  readonly validate_msg?: string;

  @ApiPropertyOptional({ description: '验证状态' })
  @IsOptional()
  @IsEnum(MateStatus)
  readonly mate_status?: MateStatus;
}
