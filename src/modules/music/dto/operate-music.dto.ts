import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';
import { IdsDto } from 'src/common/dto/common.dto';

export class AppendMusicDto extends IdsDto {
  @ApiProperty({
    description: '收藏夹id列表',
    type: 'array',
    items: { type: 'number' },
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  readonly favoritesIds: number[];
}
