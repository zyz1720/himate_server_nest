import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsByteLength, IsInt } from 'class-validator';
import { DataLength } from 'src/common/constants/database-enum.const';

export class UpdateAppPackageDto {
  @ApiPropertyOptional({ description: '文件id' })
  @IsOptional()
  @IsInt()
  readonly file_id?: number;

  @ApiPropertyOptional({ description: '应用包名称' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly app_name?: string;

  @ApiPropertyOptional({ description: '应用版本' })
  @IsOptional()
  @IsByteLength(0, DataLength.Short)
  readonly app_version?: string;

  @ApiPropertyOptional({ description: '应用描述' })
  @IsOptional()
  @IsByteLength(0, DataLength.Longer)
  readonly app_description?: string;
}
