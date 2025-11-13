import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddMessageReadRecordsDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty()
  readonly user_id: number;

  @ApiProperty({ description: '消息id', required: true })
  @IsNotEmpty()
  readonly message_id: number;

  @ApiProperty({ description: '会话uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  readonly session_id: string;
}
