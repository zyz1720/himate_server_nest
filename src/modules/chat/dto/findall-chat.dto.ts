import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import {
  chatType,
  msgType,
  msgStatus,
} from 'src/commom/constants/base-enum.const';

export class FindAllChatDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '发送方uid' })
  send_uid?: number;

  @ApiPropertyOptional({ description: '会话id' })
  session_id?: string;

  @ApiPropertyOptional({ description: '消息' })
  msgdata?: string;

  @ApiPropertyOptional({
    description: '消息状态',
    enum: msgStatus,
  })
  msg_status?: string;

  @ApiPropertyOptional({
    description: '消息类型',
    enum: msgType,
  })
  msg_type?: string;

  @ApiPropertyOptional({
    description: '会话类型',
    enum: chatType,
  })
  chat_type?: string;

  @ApiPropertyOptional({ description: '是否分页', default: true })
  readonly isPaging?: boolean;
}
