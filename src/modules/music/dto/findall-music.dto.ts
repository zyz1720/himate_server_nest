import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsByteLength,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import {
  DataLength,
  NumericStatus,
} from 'src/common/constants/base-enum.const';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllMusicDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({
    description: '文件名称',
  })
  @IsOptional()
  readonly file_name?: string;

  @ApiPropertyOptional({
    description: '文件大小',
  })
  @IsOptional()
  readonly file_size?: number;

  @ApiPropertyOptional({
    description: '上传用户id',
  })
  @IsOptional()
  readonly upload_uid?: number;

  @ApiPropertyOptional({
    description: '音乐名称',
  })
  @IsByteLength(0, DataLength.Long)
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional({
    description: '音乐作者',
  })
  @IsByteLength(0, DataLength.Long)
  @IsOptional()
  readonly artist?: string;

  @ApiPropertyOptional({
    description: '专辑名称',
  })
  @IsByteLength(0, DataLength.Long)
  @IsOptional()
  readonly album?: string;

  @ApiPropertyOptional({
    description: '是否有扩展信息 (0:否, 1:是)',
    enum: NumericStatus,
  })
  @IsOptional()
  @IsEnum(NumericStatus)
  @Type(() => Number)
  readonly isMusicMore?: NumericStatus;

  @ApiPropertyOptional({
    description: '上传时间',
  })
  @IsOptional()
  @IsDateString()
  readonly create_time?: string;
}

export class FindAllFavoritesDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({
    description: '创建者id',
  })
  @IsOptional()
  readonly creator_uid?: number;

  @ApiPropertyOptional({
    description: '创建者名称',
  })
  @IsOptional()
  readonly creator_name?: string;

  @ApiPropertyOptional({
    description: '收藏夹名称',
  })
  @IsOptional()
  readonly favorites_name?: string;

  @ApiPropertyOptional({
    description: '是否公开(0:私密, 1:公开)',
    enum: NumericStatus,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(NumericStatus)
  readonly is_public?: NumericStatus;

  @ApiPropertyOptional({ description: '是否是默认收藏夹', enum: NumericStatus })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(NumericStatus)
  readonly is_default?: NumericStatus;
}

export class FindMusicMoreDto {
  @ApiProperty({
    description: '歌曲名称',
    required: true,
  })
  @IsNotEmpty({ message: '歌曲名称不能为空' })
  readonly word: string;

  @ApiPropertyOptional({
    description: '页数',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly page?: number;

  @ApiPropertyOptional({
    description: '每页显示数量',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly num?: number;
}

export class FindMusicUrlDto {
  @ApiProperty({
    description: '歌曲id',
    required: true,
  })
  @IsNotEmpty({ message: '歌曲id不能为空' })
  readonly id: string;

  @ApiPropertyOptional({
    description: '音质 (0-16)',
    default: 14,
  })
  @IsOptional()
  readonly quality?: number;

  @ApiPropertyOptional({
    description: '歌曲类型 (0或1 常规歌曲 111	华语群星 112	铃声 113	伴奏)',
    default: 0,
  })
  @IsOptional()
  readonly type?: number;

  @ApiPropertyOptional({
    description: '是否获取加密的音乐链接',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  readonly ekey?: boolean;
}
