import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsByteLength } from 'class-validator';

export class UpdateAppPackageDto {
  @ApiPropertyOptional({ description: '应用大小' })
  @IsOptional()
  readonly app_size?: number;

  @ApiPropertyOptional({ description: '应用包名称' })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly app_name?: string;

  @ApiPropertyOptional({ description: '应用版本' })
  @IsOptional()
  @IsByteLength(0, 16)
  readonly app_version?: string;

  @ApiPropertyOptional({ description: '应用描述' })
  @IsOptional()
  @IsByteLength(0, 240)
  readonly app_description?: string;

  @ApiPropertyOptional({ description: '文件路径' })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly app_file_key?: string;
}
