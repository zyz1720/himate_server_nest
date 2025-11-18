import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsInt } from 'class-validator';
import { ChatTypeEnum } from '../entity/session.entity';

export class AddSessionDto {
  @ApiProperty({ description: '会话id', required: true })
  @IsNotEmpty()
  @IsUUID()
  readonly session_id: string;

  @ApiPropertyOptional({ description: '最后一条消息的id' })
  @IsOptional()
  @IsInt()
  readonly last_msg_id?: number;

  @ApiProperty({ description: '会话类型', required: true })
  @IsNotEmpty()
  @IsEnum(ChatTypeEnum)
  readonly chat_type: ChatTypeEnum;
}
