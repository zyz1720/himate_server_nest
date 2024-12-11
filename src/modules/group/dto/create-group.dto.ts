import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateGroupDto {
  @ApiProperty({ description: '创建者uid', required: true })
  @IsNotEmpty({ message: '缺少创建者uid' })
  @IsNumber()
  readonly creator_uid: number;
}
