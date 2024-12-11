import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { UpdateGroupMemberDto } from './update-group-member.dto';

export class FindOneGroupMemberDto extends PickType(UpdateGroupMemberDto, [
  'member_remark',
  'member_role',
  'member_status',
] as const) {
  @ApiPropertyOptional({ description: '群成员id' })
  readonly id?: number;

  @ApiPropertyOptional({ description: '群id' })
  readonly group_id?: string;

  @ApiPropertyOptional({ description: '群成员id' })
  readonly member_uid?: number;
}
