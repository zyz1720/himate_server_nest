import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { FindAllSessionDto } from './findall-session.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class FindOneSessionDto extends PickType(FindAllSessionDto, [
  'msg_status',
  'chat_type',
] as const) {
  @ApiPropertyOptional({ description: '会话id' })
  @IsOptional()
  readonly id?: number;

  @ApiPropertyOptional({ description: '会话uuid' })
  @IsOptional()
  @IsUUID()
  readonly session_id?: string;
}
