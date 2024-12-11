import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllSessionDto } from './findall-session.dto';

export class FindOneSessionDto extends PickType(FindAllSessionDto, [
  'msg_status',
  'chat_type',
] as const) {
  @ApiPropertyOptional({ description: '会话id' })
  readonly id?: number;

  @ApiPropertyOptional({ description: '会话随机id' })
  readonly session_id?: string;
}
