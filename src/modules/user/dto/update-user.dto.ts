import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { FindAllUserDto } from './findAll-user.dto';
import { Request } from 'express';
import { IJwtSign } from 'src/core/auth/auth.service';
import { Role } from 'src/commom/constants/base-enum.const';
import { ForbiddenException } from '@nestjs/common';

export class UpdateUserDto extends PickType(FindAllUserDto, [
  'user_name',
  'user_role',
  'sex',
  'user_status',
] as const) {
  @ApiProperty({ description: 'id', required: true })
  @IsNotEmpty({ message: '必须有id' })
  @IsNumber()
  readonly id: number;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly account?: string;

  @ApiProperty({ description: '账号', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: '账号至少为6位' })
  readonly self_account?: string;

  @ApiPropertyOptional({ description: '头像' })
  readonly user_avatar?: string;

  @ApiProperty({ description: '新密码', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: '密码至少为6位' })
  password?: string;

  @ApiProperty({ description: '旧密码', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: '密码至少为6位' })
  readonly oldpassword?: string;

  @ApiProperty({
    description: '生日',
    required: false,
  })
  @IsOptional()
  readonly birthday?: string;

  // 动态验证user_role字段
  static fromRequest(body: any, req: Request): UpdateUserDto {
    const dto = new UpdateUserDto();
    const newDto = Object.assign(dto, body);

    const user = req.user as IJwtSign;

    if (user) {
      const isNotAdmin = !user.userRole?.includes(Role.Admin);
      const isChangingRole = body?.user_role !== undefined;
      const isChangingOtherUser = user.userId !== body?.id;

      if (isNotAdmin && (isChangingRole || isChangingOtherUser)) {
        throw new ForbiddenException('您没有此操作权限');
      }
    }

    return newDto;
  }
}
