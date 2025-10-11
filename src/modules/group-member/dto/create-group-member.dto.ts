import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsByteLength,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
} from 'class-validator';
import { DataLength } from 'src/common/constants/base-enum.const';

export class CreateGroupMemberDto {
  @ApiProperty({ description: '关联的群组id', required: true })
  @IsNotEmpty({ message: '缺少关联的群组id' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly gId: number;

  @ApiProperty({ description: '群组uuid', required: true })
  @IsNotEmpty({ message: '缺少群组uuid' })
  @IsUUID()
  readonly group_id: string;

  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  @Max(DataLength.INT)
  @IsNumber()
  readonly member_uid: number;

  @ApiPropertyOptional({ description: '群成员备注' })
  @IsByteLength(0, DataLength.Medium)
  @IsOptional()
  readonly member_remark?: string;
}
