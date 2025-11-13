import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsByteLength, IsInt } from 'class-validator';

export class AddAppPackageDto {
  @ApiProperty({ description: '文件id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly file_id: number;

  @ApiProperty({ description: '应用包名称', required: true })
  @IsNotEmpty()
  @IsByteLength(0, 48)
  readonly app_name: string;

  @ApiProperty({ description: '应用版本', required: true })
  @IsNotEmpty()
  @IsByteLength(0, 16)
  readonly app_version: string;

  @ApiProperty({ description: '应用描述', required: true })
  @IsNotEmpty()
  @IsByteLength(0, 240)
  readonly app_description: string;
}
