import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { FindAllDto } from 'src/common/dto/common.dto';
import {
  Gender,
  Role,
  Status,
  DataLength,
} from 'src/common/constants/database-enum.const';
import {
  IsByteLength,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  IsDateString,
} from 'class-validator';

export class FindAllUserDto extends PartialType(FindAllDto) {
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  @IsByteLength(0, DataLength.Medium)
  readonly user_name?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  @IsByteLength(0, DataLength.Medium)
  readonly account?: string;

  @ApiPropertyOptional({ description: '账号' })
  @IsOptional()
  @MinLength(6)
  @IsByteLength(0, DataLength.Medium)
  readonly self_account?: string;

  @ApiPropertyOptional({ description: '用户权限', enum: Role })
  @IsOptional()
  @IsEnum(Role)
  readonly user_role?: Role;

  @ApiPropertyOptional({ description: '性别', enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  readonly sex?: Gender;

  @ApiPropertyOptional({
    description: '生日',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly birthday?: string;

  @ApiPropertyOptional({
    description: '状态(enabled:正常 disabled:禁用)',
    enum: Status,
  })
  @IsEnum(Status)
  @IsOptional()
  readonly user_status?: Status;
}
