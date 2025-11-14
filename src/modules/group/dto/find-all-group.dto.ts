import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllGroupDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '群组uuid' })
  @IsOptional()
  readonly group_id?: string;

  @ApiPropertyOptional({ description: '群组名称' })
  @IsOptional()
  readonly group_name?: string;
}
