import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsByteLength,
  IsInt,
} from 'class-validator';
import { Whether } from 'src/common/constants/database-enum.const';
import { DataLength } from 'src/common/constants/database-enum.const';

export class AddFavoritesDto {
  @ApiProperty({ description: '收藏夹用户id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly favorites_uid: number;

  @ApiProperty({ description: '收藏夹描述', required: false })
  @IsOptional()
  readonly favorites_remarks?: string;

  @ApiProperty({ description: '收藏夹名', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Long)
  readonly favorites_name: string;

  @ApiProperty({
    description: '收藏夹封面',
    required: false,
    default: 'default_assets/default_favorites_cover.jpg',
  })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
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

export class AppAddFavoritesDto extends PickType(AddFavoritesDto, [
  'favorites_name',
] as const) {}
