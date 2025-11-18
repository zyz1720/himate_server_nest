import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateMessageReadRecordsDto {
  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  @IsInt()
  readonly user_id?: number;

  @ApiPropertyOptional({ description: '消息id' })
  @IsOptional()
  @IsInt()
  readonly message_id?: number;
}
