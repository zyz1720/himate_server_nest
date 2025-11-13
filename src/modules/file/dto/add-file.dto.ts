import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsByteLength,
  IsEnum,
  IsInt,
} from 'class-validator';
import { FileTypeEnum, UseTypeEnum } from '../entity/file.entity';

export class AddFileDto {
  @ApiProperty({ description: '文件类型', required: false, default: 'other' })
  @IsOptional()
  @IsEnum(FileTypeEnum)
  readonly file_type?: FileTypeEnum;

  @ApiProperty({ description: '使用类型', required: false, default: 'unknown' })
  @IsOptional()
  @IsEnum(UseTypeEnum)
  readonly use_type?: UseTypeEnum;

  @ApiProperty({ description: '文件路径', required: true })
  @IsNotEmpty()
  @IsByteLength(0, 120)
  readonly file_key: string;

  @ApiProperty({ description: '文件大小', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly file_size: number;
}
