import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GroupEntity } from 'src/modules/group/entity/group.entity';
import { MateEntity } from 'src/modules/mate/entity/mate.entity';
import { MessageEntity } from 'src/modules/message/entity/message.entity';
import {
  ChatTypeEnum,
  SessionEntity,
} from 'src/modules/session/entity/session.entity';

export class SenderInfo {
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

export class SessionExtra {
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

export class SessionWithUnreadCount extends SessionEntity {
  @ApiPropertyOptional({
    description: '未读消息数量',
    type: 'number',
  })
  @IsOptional()
  unread_count?: number;
}

export class MessageWithSenderInfo {
  @ApiProperty({
    description: '消息',
    type: MessageEntity,
  })
  @IsNotEmpty()
  message: MessageEntity;

  @ApiProperty({
    description: '发送者信息',
    type: SenderInfo,
  })
  @IsNotEmpty()
  senderInfo: SenderInfo;
}

export class SessionWithExtra {
  @ApiProperty({
    description: '会话信息',
    type: SessionWithUnreadCount,
  })
  @IsNotEmpty()
  session: SessionWithUnreadCount;

  @ApiProperty({
    description: '会话额外信息',
    type: SessionExtra,
  })
  @IsNotEmpty()
  sessionExtra: SessionExtra;

  @ApiPropertyOptional({
    description: '是否最新',
    type: 'boolean',
  })
  @IsOptional()
  isLatest?: boolean;
}

export class MessageIds {
  @ApiProperty({
    description: '消息id',
    type: 'number',
  })
  @IsNotEmpty()
  id: number;
}

export class SessionWithMateOrGroup {
  @ApiProperty({
    description: '会话成员id列表',
    type: 'array',
    items: {
      type: 'number',
    },
  })
  @IsNotEmpty()
  memberIds: number[];

  @ApiProperty({
    description: '会话信息',
    type: SessionWithUnreadCount,
  })
  @IsNotEmpty()
  session: SessionWithUnreadCount;

  @ApiPropertyOptional({
    description: '会话mate信息',
    type: MateEntity,
  })
  @IsOptional()
  mate?: MateEntity;

  @ApiPropertyOptional({
    description: '会话group信息',
    type: GroupEntity,
  })
  @IsOptional()
  group?: GroupEntity;
}

export class FullSessionMessage extends SessionWithMateOrGroup {
  @ApiProperty({
    description: '消息',
    type: MessageEntity,
  })
  @IsNotEmpty()
  message: MessageEntity;
}

export class SessionWithMateOrGroupWithLatest extends SessionWithMateOrGroup {
  @ApiPropertyOptional({
    description: '是否最新',
    type: 'boolean',
  })
  @IsOptional()
  isLatest?: boolean;
}
