import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChatDto } from 'src/modules/chat/dto/create-chat.dto';
import { IsEnum, IsNotEmpty, IsNumber, Max } from 'class-validator';
import {
  DataLength,
  MessageStatus,
} from 'src/commom/constants/base-enum.const';

export class UpdateSessionDto extends PartialType(CreateChatDto) {
  @ApiProperty({ description: '会话id', required: true })
  @IsNotEmpty({ message: '缺少会话id' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly id: number;

  @ApiProperty({ description: '消息id', required: true })
  @IsNotEmpty({ message: '缺少消息id' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly msgId: number;

  @ApiProperty({
    description: '消息状态',
    enum: MessageStatus,
    required: true,
  })
  @IsNotEmpty({ message: '缺少消息状态' })
  @IsEnum(MessageStatus)
  readonly msg_status: MessageStatus;
}
