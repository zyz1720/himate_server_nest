import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { MateStatus } from 'src/commom/constants/base-enum.const';

export class FindMateStatusDto {
  @ApiProperty({ description: '用户自己的id', required: true })
  @IsNotEmpty({ message: '缺少用户自己的id' })
  readonly selfUid: number;

  @ApiProperty({ description: '对方用户id', required: true })
  @IsNotEmpty({ message: '缺少对方用户id' })
  readonly otherUid: number;

  @ApiPropertyOptional({
    description: '好友状态',
    enum: MateStatus,
  })
  @IsEnum(MateStatus)
  @IsOptional()
  readonly mate_status?: MateStatus;
}
