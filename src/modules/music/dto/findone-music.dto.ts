import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllMusicDto } from './findall-music.dto';

export class FindOneMusicDto extends PickType(FindAllMusicDto, [
  'title',
  'artist',
  'album',
  'file_size',
  'file_name',
  'upload_uid',
] as const) {
  @ApiPropertyOptional({ description: '音乐id' })
  readonly id?: number;

  @ApiPropertyOptional({ description: '第三方音乐id' })
  readonly match_id?: string;
}
