import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import { memberStatus as groupStatus } from 'src/commom/constants/base-enum.const';

export class FindAllGroupDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '群组所属用户id' })
  readonly creator_uid?: number;

  @ApiPropertyOptional({ description: '群组名称' })
  readonly group_name?: string;

  @ApiPropertyOptional({
    description: '群状态',
    enum: groupStatus,
  })
  readonly group_status?: string;

  @ApiPropertyOptional({ description: '是否分页', default: true })
  readonly isPaging?: boolean;

  @ApiPropertyOptional({ description: '群组id列表' })
  readonly gIdList?: number[];
}
