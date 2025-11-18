import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsByteLength,
  IsEnum,
  IsInt,
} from 'class-validator';
import { MsgTypeEnum } from '../entity/message.entity';
import { DataLength } from 'src/common/constants/database-enum.const';

export class AddMessageDto {
  @ApiProperty({ description: '关联会话id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly session_primary_id: number;

  @ApiProperty({ description: '发送方id', required: true })
  @IsNotEmpty()
  readonly sender_id: number;

  @ApiProperty({ description: '发送方ip', required: false })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  sender_ip?: string;

  @ApiProperty({ description: '消息内容', required: true })
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({ description: '消息类型', required: false })
  @IsOptional()
  @IsEnum(MsgTypeEnum)
  readonly msg_type?: MsgTypeEnum;
}
