import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllUserDto } from './findAll-user.dto';

export class FindOneUserDto extends PickType(FindAllUserDto, [
  'account',
  'self_account',
] as const) {
  @ApiPropertyOptional({ description: '用户id' })
  readonly id?: number;

  @ApiPropertyOptional({ description: '密码' })
  readonly password?: string;
}
