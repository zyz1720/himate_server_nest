import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsByteLength,
  IsInt,
  IsJSON,
} from 'class-validator';
import { DataLength } from 'src/common/constants/database-enum.const';

export class AddMusicDto {
  @ApiProperty({ description: '采样率', required: false })
  @IsOptional()
  @IsInt()
  readonly sample_rate?: number;

  @ApiProperty({ description: '比特率', required: false })
  @IsOptional()
  @IsInt()
  readonly bitrate?: number;

  @ApiProperty({ description: '音乐时长', required: false })
  @IsOptional()
  @IsInt()
  readonly duration?: number;

  @ApiProperty({ description: '音乐艺术家集合', required: false })
  @IsOptional()
  @IsJSON()
  readonly artists?: string;

  @ApiProperty({ description: '文件key', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Long)
  readonly file_key: string;

  @ApiProperty({ description: '音乐名称', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Long)
  readonly title: string;

  @ApiProperty({ description: '音乐艺术家', required: false })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly artist?: string;

  @ApiProperty({ description: '专辑名', required: false })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly album?: string;
}
