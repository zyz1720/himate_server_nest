import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChatDto } from 'src/modules/chat/dto/create-chat.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { msgStatus } from 'src/commom/constants/base-enum.const';

export class UpdateSessionDto extends PartialType(CreateChatDto) {
  @ApiProperty({ description: '会话id', required: true })
  @IsNotEmpty({ message: '缺少会话id' })
  @IsNumber()
  readonly id: number;

  @ApiProperty({ description: '消息id', required: true })
  @IsNotEmpty({ message: '缺少消息id' })
  @IsNumber()
  readonly msgId: number;

  @ApiProperty({
    description: '消息状态',
    enum: msgStatus,
    required: true,
  })
  @IsNotEmpty({ message: '缺少消息状态' })
  @IsString()
  readonly msg_status: string;
}
