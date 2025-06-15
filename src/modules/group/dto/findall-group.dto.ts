import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import { MemberStatus as GroupStatus } from 'src/commom/constants/base-enum.const';
import { ArrayNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllGroupDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '群组所属用户id' })
  @IsOptional()
  readonly creator_uid?: number;

  @ApiPropertyOptional({ description: '群组名称' })
  @IsOptional()
  readonly group_name?: string;

  @ApiPropertyOptional({
    description: '群状态',
    enum: GroupStatus,
  })
  @IsOptional()
  @IsEnum(GroupStatus)
  readonly group_status?: GroupStatus;

  @ApiPropertyOptional({ description: '群组id列表' })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @ArrayNotEmpty({ message: '群组id列表不能为空' })
  readonly gIdList?: string[];
}
