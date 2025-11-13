import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsByteLength, IsEnum } from 'class-validator';
import { MsgTypeEnum } from '../entity/message.entity';

export class UpdateMessageDto {
  @ApiPropertyOptional({ description: '客户端消息id' })
  @IsOptional()
  @IsUUID()
  readonly client_msg_id?: string;

  @ApiPropertyOptional({ description: '关联会话uuid' })
  @IsOptional()
  @IsByteLength(0, 36)
  readonly session_id?: string;

  @ApiPropertyOptional({ description: '发送方id' })
  @IsOptional()
  readonly sender_id?: number;

  @ApiPropertyOptional({ description: '发送方ip' })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly sender_ip?: string;

  @ApiPropertyOptional({ description: '消息内容' })
  @IsOptional()
  readonly content?: string;

  @ApiPropertyOptional({ description: '消息类型' })
  @IsOptional()
  @IsEnum(MsgTypeEnum)
  readonly msg_type?: MsgTypeEnum;
}
