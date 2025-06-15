import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllGroupDto } from './findall-group.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class FindOneGroupDto extends PickType(FindAllGroupDto, [
  'creator_uid',
  'group_name',
  'group_status',
] as const) {
  @ApiPropertyOptional({ description: '群组id' })
  @IsOptional()
  readonly id?: number;

  @ApiPropertyOptional({ description: '群组uuid' })
  @IsOptional()
  @IsUUID()
  readonly group_id?: string;

  @ApiPropertyOptional({ description: '群组成员id' })
  @IsOptional()
  readonly member_uid?: number;
}
