import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, IsUUID, IsEnum } from 'class-validator';
import { ChatType, DataLength } from 'src/common/constants/base-enum.const';

export class CreateSessionDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly creator_uid: number;

  @ApiProperty({ description: '会话id', required: true })
  @IsNotEmpty({ message: '缺少会话id' })
  @IsUUID()
  readonly session_id: string;

  @ApiProperty({
    description: '会话类型',
    enum: ChatType,
    required: true,
  })
  @IsNotEmpty({ message: '缺少会话类型' })
  @IsEnum(ChatType)
  readonly chat_type: ChatType;
}
