import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllMateDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '好友uuid' })
  @IsOptional()
  readonly mate_id?: string;

  @ApiPropertyOptional({ description: '用户id' })
  @IsOptional()
  readonly user_id?: number;

  @ApiPropertyOptional({ description: '好友id' })
  @IsOptional()
  readonly friend_id?: number;

  @ApiPropertyOptional({ description: '好友状态' })
  @IsOptional()
  readonly mate_status?: string;
}
