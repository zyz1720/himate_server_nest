import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateMateDto {
  @ApiProperty({ description: '申请者uid', required: true })
  @IsNotEmpty({ message: '缺少申请者uid' })
  @IsNumber()
  readonly apply_uid: number;

  @ApiProperty({ description: '同意者uid', required: true })
  @IsNotEmpty({ message: '缺少同意者uid' })
  @IsNumber()
  readonly agree_uid: number;

  @ApiPropertyOptional({ description: '同意者的备注' })
  readonly agree_remark?: string;

  @ApiPropertyOptional({ description: '验证消息' })
  readonly validate_msg?: string;
}
