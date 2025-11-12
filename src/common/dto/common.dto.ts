import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class FindAllDto {
  @ApiPropertyOptional({ description: '页数', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly current?: number;

  @ApiPropertyOptional({ description: '条数', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly pageSize?: number;
}

export class IdsDto {
  @ApiProperty({
    description: 'id列表',
    type: 'array',
    items: { type: 'number' },
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  readonly ids: number[];
}
