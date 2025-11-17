import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { IdsDto } from 'src/common/dto/common.dto';

export class OperateMusicDto extends IdsDto {
  @ApiProperty({ description: '关联收藏夹id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly favoritesId: number;
}

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
