import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

// ids提交参数
export class GroupIdsDto {
  @ApiProperty({
    description: '群UUID列表',
    type: 'array',
    items: { type: 'string' },
    required: true,
  })
  @ArrayNotEmpty({ message: '群UUID列表不能为空' })
  @IsArray()
  readonly group_ids: string[];
}
