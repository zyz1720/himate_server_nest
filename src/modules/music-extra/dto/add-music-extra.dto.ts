import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsByteLength, IsInt } from 'class-validator';

export class AddMusicExtraDto {
  @ApiProperty({ description: '音乐id', required: true })
  @IsNotEmpty()
  readonly music_id: number;

  @ApiProperty({ description: '第三方音乐id', required: true })
  @IsNotEmpty()
  @IsByteLength(0, 16)
  readonly match_id: string;

  @ApiProperty({ description: '标准歌词', required: false })
  @IsOptional()
  readonly music_lyric?: string;

  @ApiProperty({ description: '翻译歌词', required: false })
  @IsOptional()
  readonly music_trans?: string;

  @ApiProperty({ description: '逐字歌词', required: false })
  @IsOptional()
  readonly music_yrc?: string;

  @ApiProperty({ description: '音译歌词', required: false })
  @IsOptional()
  readonly music_roma?: string;

  @ApiProperty({ description: '音乐封面', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly cover_file_id: number;
}
