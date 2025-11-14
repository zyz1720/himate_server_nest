import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllGroupMemberDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '关联群组id' })
  @IsOptional()
  readonly group_id?: number;

  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  readonly user_id?: number;

  @ApiPropertyOptional({ description: '群成员备注' })
  @IsOptional()
  readonly member_remarks?: string;

  @ApiPropertyOptional({ description: '群成员权限' })
  @IsOptional()
  readonly member_role?: string;

  @ApiPropertyOptional({ description: '群成员状态' })
  @IsOptional()
  readonly member_status?: string;
}
