import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { IdsDto } from 'src/common/dto/common.dto';
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

export class ReadMessageDto extends IdsDto {
  @ApiProperty({ description: '会话uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  readonly session_id: string;
}
