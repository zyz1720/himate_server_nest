import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum, IsByteLength } from 'class-validator';
import { Whether } from 'src/common/constants/database-enum.const';

export class AddFavoritesDto {
  @ApiProperty({ description: '收藏夹描述', required: false })
  @IsOptional()
  readonly favorites_remarks?: string;

  @ApiProperty({ description: '收藏夹名', required: true })
  @IsNotEmpty()
  @IsByteLength(0, 120)
  readonly favorites_name: string;

  @ApiProperty({
    description: '收藏夹封面',
    required: false,
    default: 'default_assets/default_favorites_cover.jpg',
  })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly favorites_cover?: string;

  @ApiProperty({
    description: '是否公开',
    required: false,
    default: Whether.N,
  })
  @IsOptional()
  @IsEnum(Whether)
  readonly is_public?: Whether;

  @ApiProperty({
    description: '是否是默认收藏夹',
    required: false,
    default: Whether.N,
  })
  @IsOptional()
  @IsEnum(Whether)
  readonly is_default?: Whether;
}
