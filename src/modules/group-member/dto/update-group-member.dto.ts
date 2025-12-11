import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional, IsInt, IsByteLength, IsEnum } from 'class-validator';
import {
  MemberRoleEnum,
  MemberStatusEnum,
} from '../entity/group-member.entity';
import { DataLength } from 'src/common/constants/database-enum.const';

export class UpdateGroupMemberDto {
  @ApiPropertyOptional({ description: '关联群组id' })
  @IsOptional()
  @IsInt()
  readonly group_primary_id?: number;

  @ApiPropertyOptional({ description: '关联群组uuid' })
  @IsOptional()
  @IsByteLength(0, DataLength.UUID)
  readonly group_id?: string;

  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  readonly user_id?: number;

  @ApiPropertyOptional({ description: '群成员备注' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
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

export class AppUpdateGroupMemberDto extends PickType(UpdateGroupMemberDto, [
  'member_remarks',
]) {}

export class UpdateGroupMemberAuthDto extends PickType(UpdateGroupMemberDto, [
  'member_role',
  'member_status',
]) {
  @ApiPropertyOptional({ description: '群成员id' })
  @IsOptional()
  @IsInt()
  readonly id?: number;
}
