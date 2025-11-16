import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AddFileDto } from 'src/modules/file/dto/add-file.dto';

// 文件上传参数
export class FileUploadDto extends PickType(AddFileDto, [
  'file_type',
  'use_type',
]) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsNotEmpty()
  readonly file: Express.Multer.File;
}

export class FileInfoDto extends PickType(AddFileDto, [
  'file_type',
  'use_type',
]) {
  @ApiProperty({ description: '原始文件名' })
  @IsNotEmpty()
  readonly original_file_name: string;
}
