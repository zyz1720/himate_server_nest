import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsByteLength, IsNotEmpty } from 'class-validator';
import { DataLength } from 'src/common/constants/database-enum.const';

export class AddGroupDto {
  @ApiProperty({ description: '群组名称', required: true })
  @IsNotEmpty()
  @IsByteLength(0, DataLength.Medium)
  readonly group_name: string;

  @ApiProperty({
    description: '群组头像',
    required: false,
    default: 'default_assets/default_group_avatar.jpg',
  })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  readonly group_avatar?: string;

  @ApiProperty({ description: '群组简介', required: false })
  @IsOptional()
  readonly group_introduce?: string;
}
