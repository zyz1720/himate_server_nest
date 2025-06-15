import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsByteLength,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
} from 'class-validator';
import { DataLength } from 'src/commom/constants/base-enum.const';

export class CreateMateDto {
  @ApiProperty({ description: '申请者uid', required: true })
  @IsNotEmpty({ message: '缺少申请者uid' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly apply_uid: number;

  @ApiProperty({ description: '同意者uid', required: true })
  @IsNotEmpty({ message: '缺少同意者uid' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly agree_uid: number;

  @ApiPropertyOptional({ description: '同意者的备注' })
  @IsByteLength(0, DataLength.Medium)
  @IsOptional()
  readonly agree_remark?: string;

  @ApiPropertyOptional({ description: '验证消息' })
  @IsByteLength(0, DataLength.Longer)
  @IsOptional()
  readonly validate_msg?: string;
}
