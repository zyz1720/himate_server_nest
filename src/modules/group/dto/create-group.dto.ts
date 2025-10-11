import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max } from 'class-validator';
import { DataLength } from 'src/common/constants/base-enum.const';

export class CreateGroupDto {
  @ApiProperty({ description: '创建者uid', required: true })
  @IsNotEmpty({ message: '缺少创建者uid' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly creator_uid: number;
}
