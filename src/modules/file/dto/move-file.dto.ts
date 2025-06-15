import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class MoveFileDto {
  @ApiProperty({ description: '元文件路径', required: true })
  @IsNotEmpty({ message: '元文件路径不能为空' })
  @IsString()
  readonly source_path: string;

  @ApiProperty({ description: '文件名称', required: true })
  @IsNotEmpty({ message: '文件名称不能为空' })
  @IsString()
  readonly flie_name: string;

  @ApiProperty({ description: '目标文件路径', required: true })
  @IsNotEmpty({ message: '目标文件路径不能为空' })
  @IsString()
  readonly destination_path: string;
}
