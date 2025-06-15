import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DelFileDto {
  @ApiProperty({ description: '文件路径', required: true })
  @IsNotEmpty({ message: '文件路径不能为空' })
  @IsString()
  readonly file_path: string;

  @ApiProperty({ description: '文件名称', required: true })
  @IsNotEmpty({ message: '文件名称不能为空' })
  @IsString()
  readonly flie_name: string;
}
