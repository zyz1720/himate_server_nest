import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import {
  fileUseType,
  msgType as fileType,
} from 'src/commom/constants/base-enum.const';

export class AddFileDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  readonly uid: number;

  @ApiProperty({
    description: '文件类型',
    enum: fileType,
    required: true,
  })
  @IsNotEmpty({ message: '缺少文件类型' })
  readonly file_type: string;

  @ApiProperty({
    description: '使用场景',
    enum: fileUseType,
    required: true,
  })
  @IsNotEmpty({ message: '缺少文件使用场景' })
  readonly use_type: string;
}

export class DownloadFileDto extends AddFileDto {
  @ApiProperty({ description: '下载链接', required: true })
  @IsNotEmpty({ message: '下载链接不能为空' })
  readonly url: string;
}
