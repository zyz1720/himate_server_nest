import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsByteLength,
  IsEnum,
  IsInt,
  IsHash,
} from 'class-validator';
import { FileTypeEnum, UseTypeEnum } from '../entity/file.entity';
import { DataLength } from 'src/common/constants/database-enum.const';

export class UpdateFileDto {
  @ApiPropertyOptional({ description: '原始文件名' })
  @IsOptional()
  @IsByteLength(0, DataLength.Longer)
  readonly original_file_name?: string;

  @ApiPropertyOptional({ description: '文件类型', default: 'other' })
  @IsOptional()
  @IsEnum(FileTypeEnum)
  readonly file_type?: FileTypeEnum;

  @ApiPropertyOptional({ description: '使用类型', default: 'unknown' })
  @IsOptional()
  @IsEnum(UseTypeEnum)
  readonly use_type?: UseTypeEnum;

  @ApiPropertyOptional({ description: '文件key' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly file_key?: string;

  @ApiPropertyOptional({ description: '文件大小' })
  @IsOptional()
  @IsInt()
  readonly file_size?: number;

  @ApiPropertyOptional({ description: '文件hash' })
  @IsOptional()
  @IsHash('sha256')
  readonly file_hash?: string;
}
