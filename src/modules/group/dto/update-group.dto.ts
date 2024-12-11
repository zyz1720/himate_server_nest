import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { memberStatus as groupStatus } from 'src/commom/constants/base-enum.const';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiProperty({ description: '群组自增id', required: true })
  @IsNotEmpty({ message: '缺少群自增id' })
  @IsNumber()
  readonly id: number;

  @ApiPropertyOptional({ description: '群名' })
  readonly group_name?: string;

  @ApiPropertyOptional({ description: '群头像' })
  readonly group_avatar?: string;

  @ApiPropertyOptional({ description: '群组简介' })
  readonly group_introduce?: string;

  @ApiPropertyOptional({
    description: '群状态',
    enum: groupStatus,
  })
  readonly group_status?: string;
}
