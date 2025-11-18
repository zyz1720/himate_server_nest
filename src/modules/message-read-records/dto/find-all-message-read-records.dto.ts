import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllMessageReadRecordsDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  readonly user_id?: number;

  @ApiPropertyOptional({ description: '消息id' })
  @IsOptional()
  readonly message_id?: number;
}
