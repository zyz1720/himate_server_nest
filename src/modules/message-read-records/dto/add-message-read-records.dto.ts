import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class AddMessageReadRecordsDto {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly user_id: number;

  @ApiProperty({ description: '消息id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly message_id: number;

  @ApiPropertyOptional({ description: '创建人id' })
  @IsOptional()
  @IsInt()
  readonly create_by?: number;
}
