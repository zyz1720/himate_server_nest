import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsByteLength, IsEnum } from 'class-validator';
import {
  MemberRoleEnum,
  MemberStatusEnum,
} from '../entity/group-member.entity';

export class AddGroupMemberDto {
  @ApiProperty({ description: '关联群组uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  readonly group_id: string;

  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty()
  readonly user_id: number;

  @ApiProperty({ description: '群成员备注', required: true })
  @IsNotEmpty()
  @IsByteLength(0, 48)
  readonly member_remarks: string;

  @ApiProperty({ description: '群成员权限', required: true, default: 'member' })
  @IsNotEmpty()
  @IsEnum(MemberRoleEnum)
  readonly member_role: MemberRoleEnum;

  @ApiProperty({ description: '群成员状态', required: true, default: 'normal' })
  @IsNotEmpty()
  @IsEnum(MemberStatusEnum)
  readonly member_status: MemberStatusEnum;
}
