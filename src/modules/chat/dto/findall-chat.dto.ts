import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { FindAllDto } from 'src/common/dto/common.dto';
import {
  ChatType,
  MessageType,
  MessageStatus,
} from 'src/common/constants/base-enum.const';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class FindAllChatDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '发送方uid' })
  @IsOptional()
  send_uid?: number;

  @ApiPropertyOptional({ description: '会话id' })
  @IsOptional()
  @IsUUID()
  session_id?: string;

  @ApiPropertyOptional({ description: '消息' })
  @IsOptional()
  msgdata?: string;

  @ApiPropertyOptional({
    description: '消息状态',
    enum: MessageStatus,
  })
  @IsOptional()
  @IsEnum(MessageStatus)
  msg_status?: MessageStatus;

  @ApiPropertyOptional({
    description: '消息类型',
    enum: MessageType,
  })
  @IsOptional()
  @IsEnum(MessageType)
  msg_type?: MessageType;

  @ApiPropertyOptional({
    description: '会话类型',
    enum: ChatType,
  })
  @IsOptional()
  @IsEnum(ChatType)
  chat_type?: ChatType;
}
