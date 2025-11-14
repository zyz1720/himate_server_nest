import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllFileDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '文件类型' })
  @IsOptional()
  readonly file_type?: string;

  @ApiPropertyOptional({ description: '使用类型' })
  @IsOptional()
  readonly use_type?: string;

  @ApiPropertyOptional({ description: '文件key' })
  @IsOptional()
  readonly file_key?: string;
}
