import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsByteLength, IsEnum, IsInt } from 'class-validator';
import { FileTypeEnum, UseTypeEnum } from '../entity/file.entity';

export class UpdateFileDto {
  @ApiPropertyOptional({ description: '文件类型', default: 'other' })
  @IsOptional()
  @IsEnum(FileTypeEnum)
  readonly file_type?: FileTypeEnum;

  @ApiPropertyOptional({ description: '使用类型', default: 'unknown' })
  @IsOptional()
  @IsEnum(UseTypeEnum)
  readonly use_type?: UseTypeEnum;

  @ApiPropertyOptional({ description: '文件路径' })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly file_key?: string;

  @ApiPropertyOptional({ description: '文件大小' })
  @IsOptional()
  @IsInt()
  readonly file_size?: number;
}
