import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { mateStatus } from 'src/commom/constants/base-enum.const';

export class FindMateBymIdDto {
  @ApiProperty({ description: '好友关系id', required: true })
  @IsNotEmpty({ message: '缺少好友关系id' })
  @IsString()
  readonly mate_id: string;

  @ApiPropertyOptional({ description: '发起查询用户id' })
  readonly uid?: number;

  @ApiPropertyOptional({
    description: '好友状态',
    enum: mateStatus,
  })
  readonly mate_status?: string;
}
