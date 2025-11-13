import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsByteLength,
  IsEnum,
} from 'class-validator';
import { MsgTypeEnum } from '../entity/message.entity';

export class AddMessageDto {
  @ApiProperty({ description: '客户端消息id', required: true })
  @IsNotEmpty()
  @IsUUID()
  readonly client_msg_id: string;

  @ApiProperty({ description: '关联会话uuid', required: true })
  @IsNotEmpty()
  @IsByteLength(0, 36)
  readonly session_id: string;

  @ApiProperty({ description: '发送方id', required: true })
  @IsNotEmpty()
  readonly sender_id: number;

  @ApiProperty({ description: '发送方ip', required: false })
  @IsOptional()
  @IsByteLength(0, 48)
  readonly sender_ip?: string;

  @ApiProperty({ description: '消息内容', required: true })
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({ description: '消息类型', required: false })
  @IsOptional()
  @IsEnum(MsgTypeEnum)
  readonly msg_type?: MsgTypeEnum;
}
