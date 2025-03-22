import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllFileDto } from './findall-file.dto';

export class DelFileDto extends PickType(FindAllFileDto, [
  'ids',
  'file_name',
  'file_size',
  'file_type',
  'use_type',
  'upload_uid',
  'create_time',
] as const) {
  @ApiPropertyOptional({
    description: '是否强制删除数据库记录',
    default: false,
  })
  readonly isForce?: boolean;
}
