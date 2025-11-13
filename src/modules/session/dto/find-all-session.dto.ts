import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllSessionDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '会话id' })
  @IsOptional()
  readonly session_id?: string;

  @ApiPropertyOptional({ description: '会话类型' })
  @IsOptional()
  readonly chat_type?: string;
}
