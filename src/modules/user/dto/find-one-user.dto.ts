import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllUserDto } from './find-all-user.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class findOneUserEnabledDto extends PickType(FindAllUserDto, [
  'account',
  'self_account',
] as const) {
  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  readonly id?: number;

  @ApiPropertyOptional({ description: '密码' })
  @IsOptional()
  readonly password?: string;
}

export class SearchOneUserEnabledDto extends FindAllDto {
  @ApiProperty({ description: '搜索关键词' })
  @IsNotEmpty()
  readonly keyword: string;
}
