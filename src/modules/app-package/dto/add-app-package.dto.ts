import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsByteLength, IsInt } from 'class-validator';
import { DataLength } from 'src/common/constants/database-enum.const';

export class AddAppPackageDto {
  @ApiProperty({ description: '文件id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly file_id: number;

  @ApiProperty({ description: '应用包名称', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Medium)
  readonly app_name: string;

  @ApiProperty({ description: '应用版本', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Short)
  readonly app_version: string;

  @ApiProperty({ description: '应用描述', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Longer)
  readonly app_description: string;
}
