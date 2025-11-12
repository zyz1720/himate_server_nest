import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllUserDto } from './find-all-user.dto';
import { IsOptional } from 'class-validator';

export class FindOneUserDto extends PickType(FindAllUserDto, [
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
