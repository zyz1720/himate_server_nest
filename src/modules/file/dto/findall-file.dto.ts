import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsHash, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import {
  FileUseType,
  MessageType as FileType,
} from 'src/commom/constants/base-enum.const';

export class FindAllFileDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({
    description: '文件名称',
  })
  @IsOptional()
  readonly file_name?: string;

  @ApiPropertyOptional({
    description: '文件大小',
  })
  @IsOptional()
  readonly file_size?: number;

  @ApiPropertyOptional({
    description: '文件类型',
    enum: FileType,
  })
  @IsOptional()
  @IsEnum(FileType)
  readonly file_type?: FileType;

  @ApiPropertyOptional({
    description: '使用场景',
    enum: FileUseType,
  })
  @IsOptional()
  @IsEnum(FileUseType)
  readonly use_type?: FileUseType;

  @ApiPropertyOptional({ description: '文件hash值', required: false })
  @IsOptional()
  @IsHash('sha256')
  readonly file_hash?: string;

  @ApiPropertyOptional({
    description: '上传用户id',
  })
  @IsOptional()
  readonly upload_uid?: number;

  @ApiPropertyOptional({
    description: '上传时间',
  })
  @IsOptional()
  @IsDateString()
  readonly create_time?: string;
}
