import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

// 文件上传参数
export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsNotEmpty()
  readonly file: Express.Multer.File;
}

// 写入文件参数
export class FileInfoDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: '文件key',
  })
  @IsNotEmpty()
  readonly key: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: '原始文件名',
  })
  @IsNotEmpty()
  readonly original_file_name: string;
}
