import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindOneGroupDto extends FindAllDto {
  @ApiProperty({ description: '群组ID' })
  @IsNotEmpty()
  readonly id: number;
}
