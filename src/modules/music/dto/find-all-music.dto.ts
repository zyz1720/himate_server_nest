import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllMusicDto extends PartialType(FindAllDto) {
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
  readonly file_id?: string;

  @ApiPropertyOptional({ description: '音乐名称' })
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional({ description: '音乐艺术家' })
  @IsOptional()
  readonly artist?: string;

  @ApiPropertyOptional({ description: '专辑名' })
  @IsOptional()
  readonly album?: string;
}
