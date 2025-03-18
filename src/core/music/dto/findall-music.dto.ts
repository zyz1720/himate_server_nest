import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { numStatus } from 'src/commom/constants/base-enum.const';
import { FindAllDto } from 'src/commom/dto/commom.dto';

export class FindAllMusicDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({
    description: '文件id列表',
    type: 'array',
    items: { type: 'number' },
  })
  readonly ids?: number[];

  @ApiPropertyOptional({ description: '是否分页', default: true })
  readonly isPaging?: boolean;

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
    enum: numStatus,
  })
  readonly is_public?: string;

  @ApiPropertyOptional({ description: '是否是默认收藏夹', enum: numStatus })
  readonly is_default?: string;
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
