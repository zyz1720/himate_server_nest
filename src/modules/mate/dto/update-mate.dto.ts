import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { mateStatus } from 'src/commom/constants/base-enum.const';

export class UpdateMateDto {
  @ApiProperty({ description: '好友数据id', required: true })
  @IsNotEmpty({ message: '缺少好友数据id' })
  @IsNumber()
  readonly id: number;

  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  @IsNumber()
  readonly uid: number;

  @ApiPropertyOptional({ description: '备注' })
  readonly remark?: string;

  @ApiPropertyOptional({ description: '验证消息' })
  readonly validate_msg?: string;

  @ApiPropertyOptional({
    description: '好友状态',
    enum: mateStatus,
  })
  readonly mate_status?: string;
}
