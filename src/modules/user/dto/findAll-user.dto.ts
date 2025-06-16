import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { FindAllDto } from 'src/commom/dto/commom.dto';
import {
  Gender,
  Role,
  NumericStatus,
  DataLength,
} from 'src/commom/constants/base-enum.const';
import {
  IsByteLength,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @MinLength(6, { message: '账号至少为6位' })
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
    description: '状态(1:正常,2:冻结)',
    enum: NumericStatus,
  })
  @IsEnum(NumericStatus)
  @Type(() => Number)
  @IsOptional()
  readonly user_status?: NumericStatus;
}
