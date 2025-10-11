import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsByteLength,
  IsOptional,
  Max,
  IsUrl,
} from 'class-validator';
import { DataLength } from 'src/common/constants/base-enum.const';
import { ParseFileDto } from 'src/modules/file/dto/parser-file.dto';

/* 添加音乐DTO */
export class AddMusicDto extends PickType(ParseFileDto, [
  'file_name',
  'file_size',
  'upload_uid',
] as const) {
  @ApiProperty({ description: '音乐名称', required: true })
  @IsNotEmpty({ message: '音乐名称不能为空' })
  @IsByteLength(0, DataLength.Long)
  @IsString()
  readonly title: string;

  @ApiPropertyOptional({ description: '音乐艺术家' })
  @IsByteLength(0, DataLength.Long)
  @IsOptional()
  readonly artist?: string;

  @ApiPropertyOptional({ description: '音乐艺术家集合' })
  @IsOptional()
  readonly artists?: string[];

  @ApiPropertyOptional({ description: '音乐专辑名' })
  @IsByteLength(0, DataLength.Long)
  @IsOptional()
  readonly album?: string;

  @ApiPropertyOptional({ description: '采样率' })
  @Max(DataLength.INT)
  @IsOptional()
  readonly sampleRate?: number;

  @ApiPropertyOptional({ description: '比特率' })
  @Max(DataLength.INT)
  @IsOptional()
  readonly bitrate?: number;

  @ApiPropertyOptional({ description: '音乐时长' })
  @Max(DataLength.INT)
  @IsOptional()
  readonly duration?: number;
}

/* 添加音乐收藏夹DTO */
export class AddMusicFavoritesDto {
  @ApiProperty({ description: '创建者id', required: true })
  @IsNotEmpty({ message: '创建者id不能为空' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly creator_uid: number;

  @ApiProperty({ description: '收藏夹名', required: true })
  @IsNotEmpty({ message: '收藏夹名不能为空' })
  @IsByteLength(0, DataLength.Long)
  readonly favorites_name: string;

  @ApiPropertyOptional({ description: '收藏夹封面' })
  @IsByteLength(0, DataLength.Long)
  @IsOptional()
  readonly favorites_cover?: string;

  @ApiPropertyOptional({ description: '收藏夹描述' })
  @IsOptional()
  readonly favorites_remark?: string;
}

/* 添加音乐收藏夹DTO */
export class SyncFavoritesDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly uid: number;

  @ApiProperty({ description: '收藏夹链接', required: true })
  @IsNotEmpty({ message: '收藏夹链接不能为空' })
  @IsUrl()
  readonly url: string;
}
