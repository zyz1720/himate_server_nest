import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';
import { MemberRoleEnum } from 'src/modules/group-member/entity/group-member.entity';

export class FindAllGroupDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '群组uuid' })
  @IsOptional()
  readonly group_id?: string;

  @ApiPropertyOptional({ description: '群组名称' })
  @IsOptional()
  readonly group_name?: string;
}

export class AppAppFindAllGroupDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '群成员权限' })
  @IsOptional()
  @IsEnum(MemberRoleEnum)
  readonly member_role?: MemberRoleEnum;
}
