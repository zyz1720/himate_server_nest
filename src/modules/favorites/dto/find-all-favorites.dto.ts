import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllFavoritesDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '创建者id' })
  @IsOptional()
  readonly create_by?: number;

  @ApiPropertyOptional({ description: '收藏夹名' })
  @IsOptional()
  readonly favorites_name?: string;

  @ApiPropertyOptional({ description: '是否公开' })
  @IsOptional()
  readonly is_public?: number;

  @ApiPropertyOptional({ description: '是否是默认收藏夹' })
  @IsOptional()
  readonly is_default?: number;
}
