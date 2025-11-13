import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsByteLength, IsInt } from 'class-validator';

export class AddMusicDto {
  @ApiProperty({ description: '采样率', required: false })
  @IsOptional()
  readonly sample_rate?: number;

  @ApiProperty({ description: '比特率', required: false })
  @IsOptional()
  readonly bitrate?: number;

  @ApiProperty({ description: '音乐时长', required: false })
  @IsOptional()
  readonly duration?: number;

  @ApiProperty({ description: '音乐艺术家集合', required: false })
  @IsOptional()
  readonly artists?: string;

  @ApiProperty({ description: '文件id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly file_id: number;

  @ApiProperty({ description: '音乐名称', required: true })
  @IsNotEmpty()
  @IsByteLength(0, 120)
  readonly title: string;

  @ApiProperty({ description: '音乐艺术家', required: false })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly artist?: string;

  @ApiProperty({ description: '专辑名', required: false })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly album?: string;
}
