import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ParseFileDto } from 'src/modules/file/dto/parser-file.dto';

/* 添加音乐DTO */
export class AddMusicDto extends PickType(ParseFileDto, [
  'file_name',
  'file_size',
  'upload_uid',
] as const) {
  @ApiProperty({ description: '音乐名称', required: true })
  @IsNotEmpty({ message: '音乐名称不能为空' })
  @IsString()
  readonly title: string;

  @ApiPropertyOptional({ description: '音乐艺术家' })
  readonly artist?: string;

  @ApiPropertyOptional({ description: '音乐艺术家集合' })
  readonly artists?: string[];

  @ApiPropertyOptional({ description: '音乐专辑名' })
  readonly album?: string;

  @ApiPropertyOptional({ description: '采样率' })
  readonly sampleRate?: number;

  @ApiPropertyOptional({ description: '比特率' })
  readonly bitrate?: number;

  @ApiPropertyOptional({ description: '音乐时长' })
  readonly duration?: number;
}

/* 添加音乐收藏夹DTO */
export class AddMusicFavoritesDto {
  @ApiProperty({ description: '创建者id', required: true })
  @IsNotEmpty({ message: '创建者id不能为空' })
  @IsNumber()
  readonly creator_uid: number;

  @ApiProperty({ description: '收藏夹名', required: true })
  @IsNotEmpty({ message: '收藏夹名不能为空' })
  @IsString()
  readonly favorites_name: string;

  @ApiPropertyOptional({ description: '收藏夹封面' })
  readonly favorites_cover?: string;

  @ApiPropertyOptional({ description: '收藏夹描述' })
  readonly favorites_remark?: string;
}

/* 添加音乐收藏夹DTO */
export class SyncFavoritesDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户id不能为空' })
  @IsNumber()
  readonly uid: number;

  @ApiProperty({ description: '收藏夹链接', required: true })
  @IsNotEmpty({ message: '收藏夹链接不能为空' })
  @IsString()
  readonly url: string;
}
