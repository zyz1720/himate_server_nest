import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsByteLength,
  IsEnum,
  IsInt,
  IsHash,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { MsgTypeEnum } from '../entity/message.entity';
import { DataLength } from 'src/common/constants/database-enum.const';

export class AddMessageDto {
  @ApiProperty({ description: '关联会话id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly session_primary_id: number;

  @ApiProperty({ description: '客户端消息id', required: true })
  @IsNotEmpty()
  @IsHash('sha256')
  readonly client_msg_id: string;

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

  @ApiProperty({ description: '消息类型', required: true })
  @IsNotEmpty()
  @IsEnum(MsgTypeEnum)
  readonly msg_type: MsgTypeEnum;

  @ApiPropertyOptional({ description: '是否系统消息' })
  @IsOptional()
  @IsBoolean()
  readonly is_system?: boolean;

  @ApiPropertyOptional({
    description: '要提醒的用户',
    type: 'array',
    items: { type: 'number' },
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  readonly reminders?: number[];

  @ApiPropertyOptional({ description: '创建人id' })
  @IsOptional()
  @IsInt()
  readonly create_by?: number;
}
