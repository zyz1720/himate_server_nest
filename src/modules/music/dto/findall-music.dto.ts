import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { NumericStatus } from 'src/commom/constants/base-enum.const';
import { FindAllDto } from 'src/commom/dto/commom.dto';

export class FindAllMusicDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({
    description: '文件id列表',
    type: 'array',
    items: { type: 'number' },
  })
  readonly ids?: number[];

  @ApiPropertyOptional({
    description: '是否分页',
    enum: NumericStatus,
    default: NumericStatus.True,
  })
  readonly isPaging?: number;

  @ApiPropertyOptional({
    description: '文件名称',
  })
  readonly file_name?: string;

  @ApiPropertyOptional({
    description: '文件大小',
  })
  readonly file_size?: number;

  @ApiPropertyOptional({
    description: '上传用户id',
  })
  readonly upload_uid?: number;

  @ApiPropertyOptional({
    description: '音乐名称',
  })
  readonly title?: string;

  @ApiPropertyOptional({
    description: '音乐作者',
  })
  readonly artist?: string;

  @ApiPropertyOptional({
    description: '专辑名称',
  })
  readonly album?: string;

  @ApiPropertyOptional({
    description: '是否有扩展信息 (0:否, 1:是)',
    enum: NumericStatus,
  })
  readonly isMusicMore?: number;

  @ApiProperty({
    description: '上传时间',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly create_time?: string;
}

export class FindAllFavoritesDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({
    description: '创建者id',
  })
  readonly creator_uid?: number;

  @ApiPropertyOptional({
    description: '创建者名称',
  })
  readonly creator_name?: string;

  @ApiPropertyOptional({
    description: '收藏夹名称',
  })
  readonly favorites_name?: string;

  @ApiPropertyOptional({
    description: '是否公开(0:私密, 1:公开)',
    enum: NumericStatus,
  })
  readonly is_public?: number;

  @ApiPropertyOptional({ description: '是否是默认收藏夹', enum: NumericStatus })
  readonly is_default?: number;
}

export class FindMusicMoreDto {
  @ApiProperty({
    description: '歌曲名称',
    required: true,
  })
  readonly word: string;

  @ApiPropertyOptional({
    description: '页数',
    default: 1,
  })
  readonly page?: number;

  @ApiPropertyOptional({
    description: '每页显示数量',
    default: 10,
  })
  readonly num?: number;
}

export class FindMusicUrlDto {
  @ApiProperty({
    description: '歌曲id',
    required: true,
  })
  readonly id: number;

  @ApiPropertyOptional({
    description: '音质 (0-16)',
    default: 14,
  })
  readonly quality?: number;

  @ApiPropertyOptional({
    description: '歌曲类型 (0或1 常规歌曲 111	华语群星 112	铃声 113	伴奏)',
    default: 0,
  })
  readonly type?: number;

  @ApiPropertyOptional({
    description: '是否获取加密的音乐链接',
    default: false,
  })
  readonly ekey?: boolean;
}
