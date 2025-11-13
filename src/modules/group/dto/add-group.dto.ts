import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, IsByteLength } from 'class-validator';

export class AddGroupDto {
  @ApiProperty({ description: '群组uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  readonly group_id: string;

  @ApiProperty({ description: '群组名称', required: false })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly group_name?: string;

  @ApiProperty({
    description: '群组头像',
    required: false,
    default: 'default_assets/default_group_avatar.jpg',
  })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly group_avatar?: string;

  @ApiProperty({ description: '群组简介', required: false })
  @IsOptional()
  readonly group_introduce?: string;
}
