import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FindAllDto } from 'src/commom/dto/commom.dto';

export class FindJoinGroupDto extends PartialType(FindAllDto) {
  @ApiProperty({ description: '用户uid', required: true })
  @IsNotEmpty({ message: '缺少用户uid' })
  readonly uid: number;
}
