import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindOneFavoritesDto extends PartialType(FindAllDto) {
  @ApiProperty({ description: '音乐收藏夹ID' })
  @IsNotEmpty()
  id: number;
}
