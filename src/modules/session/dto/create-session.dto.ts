import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { chatType } from 'src/commom/constants/base-enum.const';

export class CreateSessionDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  @IsNumber()
  readonly creator_uid: number;

  @ApiProperty({ description: '会话id', required: true })
  @IsNotEmpty({ message: '缺少会话id' })
  @IsString()
  readonly session_id: string;

  @ApiProperty({
    description: '会话类型',
    enum: chatType,
    required: true,
  })
  @IsNotEmpty({ message: '缺少会话类型' })
  @IsString()
  readonly chat_type: string;
}
