import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllMusicDto } from './findall-music.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { NumericStatus } from 'src/commom/constants/base-enum.const';

export class EditMusicDto extends PickType(FindAllMusicDto, [
  'title',
  'artist',
  'album',
] as const) {
  @ApiProperty({
    description: '音乐id',
    required: true,
  })
  @IsNotEmpty({ message: '音乐id不能为空' })
  readonly id: number;

  @ApiProperty({
    description: '用户id',
    required: true,
  })
  @IsNotEmpty({ message: '用户id不能为空' })
  readonly uid: number;

  @ApiPropertyOptional({
    description: '音乐作者',
  })
  readonly artists?: Array<string>;

  @ApiPropertyOptional({
    description: '第三方音乐id',
  })
  readonly m_id?: number;

  @ApiPropertyOptional({
    description: '是否重置音乐扩展信息(0:否, 1:是)',
    enum: NumericStatus,
    default: NumericStatus.False,
  })
  readonly reset_more?: string;
}

export class EditFavoritesDto {
  @ApiProperty({
    description: '收藏夹id',
    required: true,
  })
  @IsNotEmpty({ message: '收藏夹id不能为空' })
  @IsNumber()
  readonly id: number;

  @ApiPropertyOptional({
    description: '收藏的音乐列表',
    type: 'array',
    items: { type: 'number' },
  })
  readonly musicIds?: number[];

  @ApiPropertyOptional({
    description:
      ' (有music_ids 字段时为批量修改,type:add:添加音乐,remove:取消收藏)',
    enum: ['add', 'remove'],
  })
  readonly handleType?: string;

  @ApiPropertyOptional({
    description: '收藏夹名称',
  })
  readonly favorites_name?: string;

  @ApiPropertyOptional({
    description: '收藏夹封面',
  })
  readonly favorites_cover?: string;

  @ApiPropertyOptional({
    description: '收藏夹描述',
  })
  readonly favorites_remark?: string;

  @ApiPropertyOptional({
    description: '是否公开(0:私密, 1:公开)',
    enum: NumericStatus,
  })
  readonly is_public?: string;
}

export class EditDefaultFavoritesDto extends PickType(EditFavoritesDto, [
  'musicIds',
  'handleType',
] as const) {
  @ApiProperty({
    description: '用户id',
    required: true,
  })
  @IsNotEmpty({ message: '用户id不能为空' })
  @IsNumber()
  readonly creator_uid: number;
}

export class MatchMusicMoreDto {
  @ApiProperty({
    description: '用户id',
    required: true,
  })
  @IsNotEmpty({ message: '用户id不能为空' })
  readonly uid: number;

  @ApiPropertyOptional({
    description: '匹配的数量',
    default: 10,
  })
  readonly num?: number;
}
