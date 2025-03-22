import { ApiPropertyOptional } from '@nestjs/swagger';
import { numStatus } from 'src/commom/constants/base-enum.const';

export class FindOneFavoritesDto {
  @ApiPropertyOptional({ description: '歌单id' })
  readonly id?: number;

  @ApiPropertyOptional({ description: '是否查找音乐', default: true })
  readonly isFindMusic?: boolean;

  @ApiPropertyOptional({ description: '创建者id' })
  readonly creator_uid?: number;

  @ApiPropertyOptional({ description: '歌单名称' })
  readonly favorites_name?: string;

  @ApiPropertyOptional({ description: '是否是默认收藏夹', enum: numStatus })
  readonly is_default?: string;
}
