import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsByteLength, IsEnum } from 'class-validator';
import {
  MemberRoleEnum,
  MemberStatusEnum,
} from '../entity/group-member.entity';

export class UpdateGroupMemberDto {
  @ApiPropertyOptional({ description: '关联群组uuid' })
  @IsOptional()
  @IsUUID()
  readonly group_id?: string;

  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  readonly user_id?: number;

  @ApiPropertyOptional({ description: '群成员备注' })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly member_remarks?: string;

  @ApiPropertyOptional({ description: '群成员权限', default: 'member' })
  @IsOptional()
  @IsEnum(MemberRoleEnum)
  readonly member_role?: MemberRoleEnum;

  @ApiPropertyOptional({ description: '群成员状态', default: 'normal' })
  @IsOptional()
  @IsEnum(MemberStatusEnum)
  readonly member_status?: MemberStatusEnum;
}
