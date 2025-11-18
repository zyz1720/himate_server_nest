import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddMessageReadRecordsDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly user_id: number;

  @ApiProperty({ description: '消息id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly message_id: number;
}
