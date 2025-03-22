import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import {
  fileUseType,
  msgType as fileType,
} from 'src/commom/constants/base-enum.const';

export class FindAllFileDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({
    description: '文件id列表',
    type: 'array',
    items: { type: 'number' },
  })
  readonly ids?: number[];

  @ApiPropertyOptional({ description: '是否分页', default: true })
  readonly isPaging?: boolean;

  @ApiPropertyOptional({
    description: '文件名称',
  })
  readonly file_name?: string;

  @ApiPropertyOptional({
    description: '文件大小',
  })
  readonly file_size?: number;

  @ApiPropertyOptional({
    description: '文件类型',
    enum: fileType,
  })
  readonly file_type?: string;

  @ApiPropertyOptional({
    description: '使用场景',
    enum: fileUseType,
  })
  readonly use_type?: string;

  @ApiPropertyOptional({ description: '文件hash值' })
  readonly file_hash?: string;

  @ApiPropertyOptional({
    description: '上传用户id',
  })
  readonly upload_uid?: number;

  @ApiProperty({
    description: '上传时间',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly create_time?: string;
}
