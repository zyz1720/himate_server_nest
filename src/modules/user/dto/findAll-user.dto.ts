import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import {
  gender,
  userRole,
  numStatus,
} from 'src/commom/constants/base-enum.const';

export class FindAllUserDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({
    description: '用户id列表',
    type: 'array',
    items: { type: 'number' },
  })
  readonly ids?: number[];

  @ApiPropertyOptional({ description: '是否分页', default: true })
  readonly isPaging?: boolean;

  @ApiPropertyOptional({ description: '用户名' })
  readonly user_name?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  readonly account?: string;

  @ApiPropertyOptional({ description: '账号' })
  readonly self_account?: string;

  @ApiPropertyOptional({
    description: '用户权限',
    enum: userRole,
  })
  readonly user_role?: string;

  @ApiPropertyOptional({
    description: '性别',
    enum: gender,
  })
  readonly sex?: string;

  @ApiPropertyOptional({
    description: '状态(1:正常,2:冻结)',
    enum: numStatus,
  })
  readonly user_status?: string;
}
