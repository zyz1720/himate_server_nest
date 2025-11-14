import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsByteLength, IsInt } from 'class-validator';
import { DataLength } from 'src/common/constants/database-enum.const';

export class UpdateMusicDto {
  @ApiPropertyOptional({ description: '采样率' })
  @IsOptional()
  readonly sample_rate?: number;

  @ApiPropertyOptional({ description: '比特率' })
  @IsOptional()
  readonly bitrate?: number;

  @ApiPropertyOptional({ description: '音乐时长' })
  @IsOptional()
  readonly duration?: number;

  @ApiPropertyOptional({ description: '音乐艺术家集合' })
  @IsOptional()
  readonly artists?: string;

  @ApiPropertyOptional({ description: '文件id' })
  @IsOptional()
  @IsInt()
  readonly file_id?: number;

  @ApiPropertyOptional({ description: '音乐名称' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly title?: string;

  @ApiPropertyOptional({ description: '音乐艺术家' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly artist?: string;

  @ApiPropertyOptional({ description: '专辑名' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly album?: string;
}
