import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsByteLength } from 'class-validator';

export class UpdateMusicExtraDto {
  @ApiPropertyOptional({ description: '音乐id' })
  @IsOptional()
  readonly music_id?: number;

  @ApiPropertyOptional({ description: '第三方音乐id' })
  @IsOptional()
  @IsByteLength(0, 16)
  readonly match_id?: string;

  @ApiPropertyOptional({ description: '标准歌词' })
  @IsOptional()
  readonly music_lyric?: string;

  @ApiPropertyOptional({ description: '翻译歌词' })
  @IsOptional()
  readonly music_trans?: string;

  @ApiPropertyOptional({ description: '逐字歌词' })
  @IsOptional()
  readonly music_yrc?: string;

  @ApiPropertyOptional({ description: '音译歌词' })
  @IsOptional()
  readonly music_roma?: string;

  @ApiPropertyOptional({ description: '音乐封面' })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly music_cover?: string;
}
