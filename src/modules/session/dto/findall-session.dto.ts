import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import { ChatType, MessageStatus } from 'src/commom/constants/base-enum.const';

export class FindAllSessionDto extends PartialType(FindAllDto) {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  readonly uid: number;

  @ApiPropertyOptional({
    description: '消息状态',
    enum: MessageStatus,
  })
  readonly msg_status?: string;

  @ApiPropertyOptional({
    description: '会话类型',
    enum: ChatType,
  })
  readonly chat_type?: string;
}
