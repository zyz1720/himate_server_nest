import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import { mateStatus } from 'src/commom/constants/base-enum.const';

export class FindAllMateDto extends PartialType(FindAllDto) {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  readonly uid: number;

  @ApiPropertyOptional({
    description: '好友状态',
    enum: mateStatus,
  })
  readonly mate_status?: string;
}
