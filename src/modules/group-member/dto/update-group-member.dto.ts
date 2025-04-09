import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  MemberStatus,
  GroupMemberRole,
} from 'src/commom/constants/base-enum.const';

export class UpdateGroupMemberDto {
  @ApiProperty({ description: '群成员id', required: true })
  @IsNotEmpty({ message: '缺少群成员id' })
  @IsNumber()
  readonly id: number;

  @ApiPropertyOptional({ description: '群成员头像' })
  readonly member_avatar?: string;

  @ApiPropertyOptional({ description: '群成员备注' })
  readonly member_remark?: string;

  @ApiPropertyOptional({ description: '群成员权限', enum: GroupMemberRole })
  readonly member_role?: string;

  @ApiPropertyOptional({ description: '群成员状态', enum: MemberStatus })
  readonly member_status?: string;
}
