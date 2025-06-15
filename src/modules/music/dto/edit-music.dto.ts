import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllMusicDto } from './findall-music.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsByteLength,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
} from 'class-validator';
import {
  NumericStatus,
  HandleType,
  DataLength,
} from 'src/commom/constants/base-enum.const';
import { Type } from 'class-transformer';

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
  @Max(DataLength.INT)
  @IsNumber()
  readonly id: number;

  @ApiProperty({
    description: '用户id',
    required: true,
  })
  @IsNotEmpty({ message: '用户id不能为空' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly uid: number;

  @ApiPropertyOptional({
    description: '音乐作者',
  })
  @IsOptional()
  @IsJSON()
  readonly artists?: Array<string>;

  @ApiPropertyOptional({
    description: '第三方音乐id',
  })
  @IsByteLength(0, DataLength.Short)
  @IsOptional()
  readonly m_id?: string;

  @ApiPropertyOptional({
    description: '是否重置音乐扩展信息(0:否, 1:是)',
    enum: NumericStatus,
    default: NumericStatus.False,
  })
  @IsEnum(NumericStatus)
  @IsOptional()
  readonly reset_more?: NumericStatus;
}

export class EditFavoritesDto {
  @ApiProperty({
    description: '收藏夹id',
    required: true,
  })
  @IsNotEmpty({ message: '收藏夹id不能为空' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly id: number;

  @ApiPropertyOptional({
    description: '收藏的音乐列表',
    type: 'array',
    items: { type: 'number' },
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'id列表不能为空' })
  readonly musicIds?: number[];

  @ApiPropertyOptional({
    description:
      ' (有music_ids 字段时为批量修改,type:add:添加音乐,remove:取消收藏)',
    enum: HandleType,
  })
  @IsOptional()
  @IsEnum(HandleType)
  readonly handleType?: HandleType;

  @ApiPropertyOptional({
    description: '收藏夹名称',
  })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly favorites_name?: string;

  @ApiPropertyOptional({
    description: '收藏夹封面',
  })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly favorites_cover?: string;

  @ApiPropertyOptional({
    description: '收藏夹描述',
  })
  @IsOptional()
  readonly favorites_remark?: string;

  @ApiPropertyOptional({
    description: '是否公开(0:私密, 1:公开)',
    enum: NumericStatus,
  })
  @IsOptional()
  @IsEnum(NumericStatus)
  readonly is_public?: NumericStatus;
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
  @Max(DataLength.INT)
  @IsNumber()
  readonly creator_uid: number;
}

export class MatchMusicMoreDto {
  @ApiProperty({
    description: '用户id',
    required: true,
  })
  @IsNotEmpty({ message: '用户id不能为空' })
  @Type(() => Number)
  @Max(DataLength.INT)
  readonly uid: number;

  @ApiPropertyOptional({
    description: '匹配的数量',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  readonly num?: number;
}
