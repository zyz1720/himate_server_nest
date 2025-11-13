import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsByteLength, IsEnum } from 'class-validator';
import { Whether } from 'src/common/constants/database-enum.const';

export class UpdateFavoritesDto {
  @ApiPropertyOptional({ description: '收藏夹描述' })
  @IsOptional()
  readonly favorites_remarks?: string;

  @ApiPropertyOptional({ description: '收藏夹名' })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly favorites_name?: string;

  @ApiPropertyOptional({
    description: '收藏夹封面',
    default: 'default_assets/default_favorites_cover.jpg',
  })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly favorites_cover?: string;

  @ApiPropertyOptional({ description: '是否公开', default: Whether.N })
  @IsOptional()
  @IsEnum(Whether)
  readonly is_public?: Whether;

  @ApiPropertyOptional({
    description: '是否是默认收藏夹',
    default: Whether.N,
  })
  @IsOptional()
  @IsEnum(Whether)
  readonly is_default?: Whether;
}
