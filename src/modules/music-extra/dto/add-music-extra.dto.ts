import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsByteLength } from 'class-validator';
import { DataLength } from 'src/common/constants/database-enum.const';

export class AddMusicExtraDto {
  @ApiProperty({ description: '音乐id', required: true })
  @IsNotEmpty()
  readonly music_id: number;

  @ApiProperty({ description: '第三方音乐id', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Short)
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
  @IsByteLength(0, DataLength.Long)
  readonly music_cover: string;
}
