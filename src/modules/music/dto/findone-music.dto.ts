import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllMusicDto } from './findall-music.dto';
import { IsOptional } from 'class-validator';

export class FindOneMusicDto extends PickType(FindAllMusicDto, [
  'title',
  'artist',
  'album',
  'file_size',
  'file_name',
  'upload_uid',
] as const) {
  @ApiPropertyOptional({ description: '音乐id' })
  @IsOptional()
  readonly id?: number;

  @ApiPropertyOptional({ description: '第三方音乐id' })
  @IsOptional()
  readonly match_id?: string;
}
