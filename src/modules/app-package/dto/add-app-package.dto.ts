import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddAppPackageDto {
  @ApiProperty({ description: '应用包名称', required: true })
  @IsNotEmpty({ message: '缺少应用包名称' })
  @IsString()
  readonly app_name: string;

  @ApiProperty({ description: '应用版本', required: true })
  @IsNotEmpty({ message: '缺少应用版本' })
  @IsString()
  readonly app_version: string;

  @ApiProperty({ description: '应用描述', required: true })
  @IsNotEmpty({ message: '缺少应用描述' })
  @IsString()
  readonly app_description: string;

  @ApiProperty({ description: '应用大小', required: true })
  @IsNotEmpty({ message: '缺少应用大小' })
  @IsNumber()
  readonly app_size: number;

  @ApiProperty({ description: '应用文件名', required: true })
  @IsNotEmpty({ message: '缺少应用文件名' })
  @IsString()
  readonly app_fileName: string;
}
