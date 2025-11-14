import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllMessageDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '客户端消息id' })
  @IsOptional()
  readonly client_msg_id?: string;

  @ApiPropertyOptional({ description: '关联会话id' })
  @IsOptional()
  readonly session_primary_id?: number;

  @ApiPropertyOptional({ description: '发送方id' })
  @IsOptional()
  readonly sender_id?: number;

  @ApiPropertyOptional({ description: '发送方ip' })
  @IsOptional()
  readonly sender_ip?: string;

  @ApiPropertyOptional({ description: '消息类型' })
  @IsOptional()
  readonly msg_type?: string;
}
