import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import {
  FileUseType,
  MessageType as FileType,
} from 'src/commom/constants/base-enum.const';

export class AddFileDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  readonly uid: number;

  @ApiProperty({
    description: '文件类型',
    enum: FileType,
    required: true,
  })
  @IsNotEmpty({ message: '缺少文件类型' })
  readonly file_type: string;

  @ApiProperty({
    description: '使用场景',
    enum: FileUseType,
    required: true,
  })
  @IsNotEmpty({ message: '缺少文件使用场景' })
  readonly use_type: string;

  @ApiPropertyOptional({
    description: '是否解析文件',
    default: true,
  })
  readonly isParser?: boolean;

  @ApiPropertyOptional({
    description: '是否为文件名添加时间戳',
    default: false,
  })
  readonly isAddTimeStamp?: boolean;
}

export class DownloadFileDto extends AddFileDto {
  @ApiProperty({ description: '下载链接', required: true })
  @IsNotEmpty({ message: '下载链接不能为空' })
  readonly url: string;
}
