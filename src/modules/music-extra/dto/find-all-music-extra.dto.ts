import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllMusicExtraDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '音乐id' })
  @IsOptional()
  readonly music_id?: number;

  @ApiPropertyOptional({ description: '第三方音乐id' })
  @IsOptional()
  readonly match_id?: string;
}
