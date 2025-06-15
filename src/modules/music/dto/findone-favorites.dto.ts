import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { NumericStatus } from 'src/commom/constants/base-enum.const';

export class FindOneFavoritesDto {
  @ApiPropertyOptional({ description: '歌单id' })
  @IsOptional()
  readonly id?: number;

  @ApiPropertyOptional({ description: '是否查找音乐', enum: NumericStatus })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(NumericStatus)
  readonly isFindMusic?: NumericStatus;

  @ApiPropertyOptional({ description: '创建者id' })
  @IsOptional()
  readonly creator_uid?: number;

  @ApiPropertyOptional({ description: '歌单名称' })
  @IsOptional()
  readonly favorites_name?: string;

  @ApiPropertyOptional({ description: '是否是默认收藏夹', enum: NumericStatus })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(NumericStatus)
  readonly is_default?: NumericStatus;
}
