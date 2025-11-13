import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateMessageReadRecordsDto {
  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  readonly user_id?: number;

  @ApiPropertyOptional({ description: '消息id' })
  @IsOptional()
  readonly message_id?: number;

  @ApiPropertyOptional({ description: '会话uuid' })
  @IsOptional()
  @IsUUID()
  readonly session_id?: string;
}
