import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsByteLength } from 'class-validator';

export class UpdateAppPackageDto {
  @ApiProperty({ description: '应用大小', required: true })
  @IsOptional()
  readonly app_size?: number;

  @ApiProperty({ description: '应用包名称', required: true })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly app_name?: string;

  @ApiProperty({ description: '应用版本', required: true })
  @IsOptional()
  @IsByteLength(0, 16)
  readonly app_version?: string;

  @ApiProperty({ description: '应用描述', required: true })
  @IsOptional()
  @IsByteLength(0, 240)
  readonly app_description?: string;

  @ApiProperty({ description: '文件路径', required: true })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly app_file_key?: string;
}
