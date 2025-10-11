import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  Max,
} from 'class-validator';
import {
  FileUseType,
  MessageType as FileType,
  NumericStatus,
  DataLength,
} from 'src/common/constants/base-enum.const';

export class AddFileDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  @Max(DataLength.INT)
  @IsNumber()
  @Type(() => Number)
  readonly uid: number;

  @ApiProperty({
    description: '文件类型',
    enum: FileType,
    required: true,
  })
  @IsNotEmpty({ message: '缺少文件类型' })
  @IsEnum(FileType)
  readonly file_type: FileType;

  @ApiProperty({
    description: '使用场景',
    enum: FileUseType,
    required: true,
  })
  @IsNotEmpty({ message: '缺少文件使用场景' })
  @IsEnum(FileUseType)
  readonly use_type: FileUseType;

  @ApiPropertyOptional({
    description: '是否解析文件',
    default: NumericStatus.False,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsEnum(NumericStatus)
  readonly isParser?: NumericStatus;

  @ApiPropertyOptional({
    description: '是否为文件名添加时间戳',
    default: NumericStatus.False,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsEnum(NumericStatus)
  readonly isAddTimeStamp?: NumericStatus;
}

export class DownloadFileDto extends AddFileDto {
  @ApiProperty({ description: '下载链接', required: true })
  @IsNotEmpty({ message: '下载链接不能为空' })
  @IsUrl()
  readonly url: string;
}
