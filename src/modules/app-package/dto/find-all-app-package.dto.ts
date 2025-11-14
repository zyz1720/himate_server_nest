import { ApiPropertyOptional, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindAllAppPackageDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '应用名称' })
  @IsOptional()
  readonly app_name?: string;
}

export class AppFindAllAppPackageDto extends PartialType(FindAllDto) {
  @ApiProperty({ description: '应用名称' })
  @IsNotEmpty()
  readonly app_name: string;
}
