import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsByteLength,
  Max,
} from 'class-validator';
import { DataLength } from 'src/common/constants/base-enum.const';

export class AddAppPackageDto {
  @ApiProperty({ description: '应用包名称', required: true })
  @IsNotEmpty({ message: '缺少应用包名称' })
  @IsByteLength(0, DataLength.Medium)
  readonly app_name: string;

  @ApiProperty({ description: '应用版本', required: true })
  @IsNotEmpty({ message: '缺少应用版本' })
  @IsString()
  @IsByteLength(0, DataLength.Short)
  readonly app_version: string;

  @ApiProperty({ description: '应用描述', required: true })
  @IsNotEmpty({ message: '缺少应用描述' })
  @IsByteLength(0, DataLength.Longer)
  readonly app_description: string;

  @ApiProperty({ description: '应用大小', required: true })
  @IsNotEmpty({ message: '缺少应用大小' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly app_size: number;

  @ApiProperty({ description: '应用文件名', required: true })
  @IsNotEmpty({ message: '缺少应用文件名' })
  @IsByteLength(0, DataLength.Long)
  readonly app_fileName: string;
}
