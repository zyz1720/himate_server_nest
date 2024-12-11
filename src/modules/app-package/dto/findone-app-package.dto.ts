import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindOneAppPackageDto {
  @ApiPropertyOptional({ description: '应用包id' })
  readonly id?: number;

  @ApiPropertyOptional({ description: '应用包名称' })
  readonly app_name?: string;

  @ApiPropertyOptional({ description: '应用版本' })
  readonly app_version?: string;

  @ApiPropertyOptional({ description: '应用描述' })
  readonly app_description?: string;

  @ApiPropertyOptional({ description: '应用文件名' })
  readonly app_fileName?: string;
}
