import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsByteLength,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
} from 'class-validator';
import { DataLength, MateStatus } from 'src/common/constants/base-enum.const';

export class UpdateMateDto {
  @ApiProperty({ description: '好友数据id', required: true })
  @IsNotEmpty({ message: '缺少好友数据id' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly id: number;

  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  @IsNumber()
  @Max(DataLength.INT)
  readonly uid: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly remark?: string;

  @ApiPropertyOptional({ description: '验证消息' })
  @IsByteLength(0, DataLength.Longer)
  @IsOptional()
  readonly validate_msg?: string;

  @ApiPropertyOptional({
    description: '好友状态',
    enum: MateStatus,
  })
  @IsEnum(MateStatus)
  @IsOptional()
  readonly mate_status?: MateStatus;
}
