import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { UpdateGroupMemberDto } from './update-group-member.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class FindOneGroupMemberDto extends PickType(UpdateGroupMemberDto, [
  'member_remark',
  'member_role',
  'member_status',
] as const) {
  @ApiPropertyOptional({ description: '群成员表id' })
  @IsOptional()
  readonly id?: number;

  @ApiPropertyOptional({ description: '群id' })
  @IsOptional()
  @IsUUID()
  readonly group_id?: string;

  @ApiPropertyOptional({ description: '群成员用户id' })
  @IsOptional()
  readonly member_uid?: number;
}
