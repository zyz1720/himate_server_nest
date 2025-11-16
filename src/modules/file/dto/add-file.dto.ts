import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsByteLength,
  IsEnum,
  IsInt,
  IsHash,
  IsUrl,
} from 'class-validator';
import { FileTypeEnum, UseTypeEnum } from '../entity/file.entity';
import { DataLength } from 'src/common/constants/database-enum.const';

export class AddFileDto {
  @ApiProperty({ description: '原始文件名', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Longer)
  readonly original_file_name: string;

  @ApiProperty({ description: '文件类型', required: false, default: 'other' })
  @IsOptional()
  @IsEnum(FileTypeEnum)
  readonly file_type?: FileTypeEnum;

  @ApiProperty({ description: '使用类型', required: false, default: 'unknown' })
  @IsOptional()
  @IsEnum(UseTypeEnum)
  readonly use_type?: UseTypeEnum;

  @ApiProperty({ description: '文件key', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Long)
  readonly file_key: string;

  @ApiProperty({ description: '文件大小', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly file_size: number;

  @ApiProperty({ description: '文件hash', required: true })
  @IsNotEmpty()
  @IsHash('sha256')
  readonly file_hash: string;
}

export class DownloadFileDto extends PickType(AddFileDto, [
  'file_type',
  'use_type',
]) {
  @ApiProperty({ description: '下载链接', required: true })
  @IsNotEmpty({ message: '下载链接不能为空' })
  @IsUrl()
  readonly download_url: string;
}

export class AddFileAndParseDto extends AddFileDto {
  @ApiProperty({ description: '文件路径', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Longer)
  readonly file_path: string;
}
