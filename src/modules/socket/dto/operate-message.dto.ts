import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { AddMessageDto } from 'src/modules/message/dto/add-message.dto';

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

export class ReadMessageDto {
  @ApiProperty({ description: '消息id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly messageId: number;

  @ApiProperty({ description: '会话id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly sessionId: number;
}
