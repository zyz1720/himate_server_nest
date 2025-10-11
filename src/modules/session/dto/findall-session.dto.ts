import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';
import { ChatType, MessageStatus } from 'src/common/constants/base-enum.const';

export class FindAllSessionDto extends PartialType(FindAllDto) {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  readonly uid: number;

  @ApiPropertyOptional({
    description: '消息状态',
    enum: MessageStatus,
  })
  @IsOptional()
  @IsEnum(MessageStatus)
  readonly msg_status?: MessageStatus;

  @ApiPropertyOptional({
    description: '会话类型',
    enum: ChatType,
  })
  @IsOptional()
  @IsEnum(ChatType)
  readonly chat_type?: ChatType;
}
