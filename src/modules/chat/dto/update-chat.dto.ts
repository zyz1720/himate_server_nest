import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { FindAllChatDto } from './findall-chat.dto';

export class UpdateChatDto extends PickType(FindAllChatDto, [
  'msgdata',
  'msg_status',
  'msg_type',
  'chat_type',
] as const) {
  @ApiProperty({
    description: '聊天消息id',
    required: true,
  })
  @IsNotEmpty({ message: '缺少消息id' })
  @IsNumber()
  id: number;
}
