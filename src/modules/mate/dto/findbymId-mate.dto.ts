import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { MateStatus } from 'src/common/constants/base-enum.const';

export class FindMateBymIdDto {
  @ApiProperty({ description: '好友关系id', required: true })
  @IsNotEmpty({ message: '缺少好友关系id' })
  @IsUUID()
  readonly mate_id: string;

  @ApiPropertyOptional({ description: '发起查询用户id' })
  @IsOptional()
  readonly uid?: number;

  @ApiPropertyOptional({
    description: '好友状态',
    enum: MateStatus,
  })
  @IsEnum(MateStatus)
  @IsOptional()
  readonly mate_status?: MateStatus;
}
