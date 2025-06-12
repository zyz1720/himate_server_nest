import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindOneAppPackageDto {
  @ApiPropertyOptional({ description: '应用包id' })
  @IsOptional()
  readonly id?: number;

  @ApiPropertyOptional({ description: '应用包名称' })
  @IsOptional()
  readonly app_name?: string;

  @ApiPropertyOptional({ description: '应用版本' })
  @IsOptional()
  readonly app_version?: string;

  @ApiPropertyOptional({ description: '应用描述' })
  @IsOptional()
  readonly app_description?: string;

  @ApiPropertyOptional({ description: '应用文件名' })
  @IsOptional()
  readonly app_fileName?: string;
}
