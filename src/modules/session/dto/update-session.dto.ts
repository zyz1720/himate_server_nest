import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsInt } from 'class-validator';
import { ChatTypeEnum } from '../entity/session.entity';

export class UpdateSessionDto {
  @ApiPropertyOptional({ description: '会话id' })
  @IsOptional()
  @IsUUID()
  readonly session_id?: string;

  @ApiPropertyOptional({ description: '最后一条消息的id' })
  @IsOptional()
  @IsInt()
  readonly last_msg_id?: number;

  @ApiPropertyOptional({ description: '会话类型' })
  @IsOptional()
  @IsEnum(ChatTypeEnum)
  readonly chat_type?: ChatTypeEnum;
}
