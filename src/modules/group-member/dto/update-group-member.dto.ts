import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsByteLength,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
} from 'class-validator';
import {
  MemberStatus,
  GroupMemberRole,
  DataLength,
} from 'src/common/constants/base-enum.const';

export class UpdateGroupMemberDto {
  @ApiProperty({ description: '群成员表id', required: true })
  @IsNotEmpty({ message: '缺少群成员表id' })
  @IsNumber()
  @Max(DataLength.INT)
  readonly id: number;

  @ApiPropertyOptional({ description: '群成员头像' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly member_avatar?: string;

  @ApiPropertyOptional({ description: '群成员备注' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly member_remark?: string;

  @ApiPropertyOptional({ description: '群成员权限', enum: GroupMemberRole })
  @IsOptional()
  @IsEnum(GroupMemberRole)
  readonly member_role?: GroupMemberRole;

  @ApiPropertyOptional({ description: '群成员状态', enum: MemberStatus })
  @IsOptional()
  @IsEnum(MemberStatus)
  readonly member_status?: MemberStatus;
}
