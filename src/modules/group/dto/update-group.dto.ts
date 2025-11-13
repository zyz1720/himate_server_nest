import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsByteLength } from 'class-validator';

export class UpdateGroupDto {
  @ApiPropertyOptional({ description: '群组uuid' })
  @IsOptional()
  @IsUUID()
  readonly group_id?: string;

  @ApiPropertyOptional({ description: '群组名称' })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly group_name?: string;

  @ApiPropertyOptional({
    description: '群组头像',
    default: 'default_assets/default_group_avatar.jpg',
  })
  @IsOptional()
  @IsByteLength(0, 120)
  readonly group_avatar?: string;

  @ApiPropertyOptional({ description: '群组简介' })
  @IsOptional()
  readonly group_introduce?: string;
}
