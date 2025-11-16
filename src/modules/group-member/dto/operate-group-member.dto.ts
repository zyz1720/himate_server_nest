import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { IdsDto } from 'src/common/dto/common.dto';

export class OperateGroupMemberDto extends IdsDto {
  @ApiProperty({ description: '关联群组id', required: true })
  @IsNotEmpty()
  @IsInt()
  readonly groupId: number;
}
