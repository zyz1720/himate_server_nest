import { ApiPropertyOptional, PartialType, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';
import { UseTypeEnum } from '../entity/file.entity';

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

export class FindAllAppFileDto extends PartialType(FindAllDto) {
  @ApiProperty({ description: '使用类型' })
  @IsEnum(UseTypeEnum)
  readonly use_type: UseTypeEnum;
}
