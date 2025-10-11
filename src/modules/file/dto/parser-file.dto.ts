import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsByteLength,
  Max,
} from 'class-validator';
import { DataLength } from 'src/common/constants/base-enum.const';

export class ParseFileDto {
  @ApiProperty({ description: '歌曲文件路径', required: true })
  @IsNotEmpty({ message: '歌曲文件路径不能为空' })
  @IsString()
  readonly file_path: string;

  @ApiProperty({ description: '文件名称', required: true })
  @IsNotEmpty({ message: '文件名称不能为空' })
  @IsString()
  @IsByteLength(0, DataLength.Long)
  readonly file_name: string;

  @ApiProperty({ description: '文件大小', required: true })
  @IsNumber()
  @IsNotEmpty({ message: '文件大小不能为空' })
  readonly file_size: number;

  @ApiProperty({ description: '上传用户id', required: true })
  @IsNotEmpty({ message: '上传用户id不能为空' })
  @IsNumber()
  @Max(DataLength.INT)
  readonly upload_uid: number;
}
