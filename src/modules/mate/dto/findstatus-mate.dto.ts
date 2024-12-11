import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import { mateStatus } from 'src/commom/constants/base-enum.const';

export class FindMateStatusDto extends PartialType(FindAllDto) {
  @ApiProperty({ description: '用户自己的id', required: true })
  @IsNotEmpty({ message: '缺少用户自己的id' })
  readonly selfUid: number;

  @ApiProperty({ description: '对方用户id', required: true })
  @IsNotEmpty({ message: '缺少对方用户id' })
  readonly otherUid: number;

  @ApiPropertyOptional({
    description: '好友状态',
    enum: mateStatus,
  })
  readonly mate_status?: string;
}
