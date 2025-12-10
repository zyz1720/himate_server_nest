import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { IdsDto } from 'src/common/dto/common.dto';
import { AddMessageDto } from 'src/modules/message/dto/add-message.dto';
import { ChatTypeEnum } from 'src/modules/session/entity/session.entity';

export class SendMessageDto extends PickType(AddMessageDto, [
  'session_primary_id',
  'sender_ip',
  'content',
  'msg_type',
]) {
  @ApiProperty({ description: '会话uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  readonly session_id: string;
}

export class ReadMessageDto extends IdsDto {
  @ApiProperty({ description: '会话uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  readonly session_id: string;
}

export class SenderInfoDto {
  @ApiProperty({
    description: '聊天类型',
    type: 'enum',
    enum: ChatTypeEnum,
  })
  @IsNotEmpty()
  chat_type: ChatTypeEnum;

  @ApiProperty({
    description: '用户id',
    type: 'number',
  })
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: '用户备注',
    type: 'string',
  })
  @IsNotEmpty()
  remarks: string;

  @ApiProperty({
    description: '用户头像',
    type: 'string',
  })
  @IsNotEmpty()
  avatar: string;
}

export class SessionExtraDto {
  @ApiPropertyOptional({
    description: '会话名称',
    type: 'string',
  })
  @IsOptional()
  session_name?: string;

  @ApiPropertyOptional({
    description: '会话头像',
    type: 'string',
  })
  @IsOptional()
  session_avatar?: string;

  @ApiPropertyOptional({
    description: '用户id',
    type: 'number',
  })
  @IsOptional()
  userId?: number;

  @ApiPropertyOptional({
    description: '群id',
    type: 'number',
  })
  @IsOptional()
  groupId?: number;

  @ApiPropertyOptional({
    description: '最后一条消息发送者备注',
    type: 'string',
  })
  @IsOptional()
  lastSenderRemarks?: string;
}
