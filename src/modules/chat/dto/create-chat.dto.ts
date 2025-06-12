import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Max,
  IsByteLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import {
  ChatType,
  MessageType,
  DataLength,
} from 'src/commom/constants/base-enum.const';

export class CreateChatDto {
  @ApiProperty({ description: '会话id', required: true })
  @IsNotEmpty({ message: '缺少会话id' })
  @IsString()
  @IsUUID()
  readonly session_id: string;

  @ApiProperty({
    description: '发送方id',
    required: true,
  })
  @IsNotEmpty({ message: '缺少发送方id' })
  @Max(DataLength.INT)
  @IsNumber()
  send_uid: number;

  @ApiPropertyOptional({ description: '发送方iP' })
  @IsByteLength(0, DataLength.Medium)
  @IsOptional()
  send_ip?: string;

  @ApiProperty({ description: '消息数据', required: true })
  @IsNotEmpty({ message: '缺少消息数据' })
  @IsString()
  msgdata: string;

  @ApiPropertyOptional({ description: '消息秘钥' })
  @IsOptional()
  @IsByteLength(0, DataLength.Long)
  msg_secret?: string;

  @ApiProperty({
    description: '会话类型',
    enum: ChatType,
    default: ChatType.Personal,
    required: true,
  })
  @IsNotEmpty({ message: '缺少会话类型' })
  @IsEnum(ChatType)
  chat_type: string;

  @ApiProperty({
    description: '消息类型',
    enum: MessageType,
    default: MessageType.Text,
    required: true,
  })
  @IsNotEmpty({ message: '缺少消息类型' })
  @IsEnum(MessageType)
  msg_type: string;
}
