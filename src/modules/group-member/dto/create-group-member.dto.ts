import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupMemberDto {
  @ApiProperty({ description: '关联的群组id', required: true })
  @IsNotEmpty({ message: '缺少关联的群组id' })
  @IsNumber()
  readonly gId: number;

  @ApiProperty({ description: '群组随机id', required: true })
  @IsNotEmpty({ message: '缺少群组随机id' })
  @IsString()
  readonly group_id: string;

  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '缺少用户id' })
  @IsNumber()
  readonly member_uid: number;

  @ApiPropertyOptional({ description: '群成员备注' })
  readonly member_remark?: string;
}
