import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { chatType, msgType } from 'src/commom/constants/base-enum.const';

export class CreateChatDto {
  @ApiProperty({ description: '会话id', required: true })
  @IsNotEmpty({ message: '缺少会话id' })
  @IsString()
  readonly session_id: string;

  @ApiProperty({
    description: '发送方id',
    required: true,
  })
  @IsNotEmpty({ message: '缺少发送方id' })
  @IsNumber()
  send_uid: number;

  @ApiPropertyOptional({ description: '发送方iP' })
  send_ip?: string;

  @ApiProperty({ description: '消息数据', required: true })
  @IsNotEmpty({ message: '缺少消息数据' })
  @IsString()
  msgdata: string;

  @ApiPropertyOptional({ description: '消息秘钥' })
  msg_secret?: string;

  @ApiProperty({
    description: '会话类型',
    enum: chatType,
    default: chatType[0],
    required: true,
  })
  @IsNotEmpty({ message: '缺少会话类型' })
  @IsString()
  chat_type: string;

  @ApiProperty({
    description: '消息类型',
    enum: msgType,
    default: msgType[0],
    required: true,
  })
  @IsNotEmpty({ message: '缺少消息类型' })
  @IsString()
  msg_type: string;
}
