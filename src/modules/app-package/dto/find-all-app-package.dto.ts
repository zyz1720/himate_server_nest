import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllAppPackageDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '应用包名称' })
  @IsOptional()
  readonly app_name?: string;
}
