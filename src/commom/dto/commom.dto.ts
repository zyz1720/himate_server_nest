import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsNumber,
  IsByteLength,
} from 'class-validator';
import { DataLength, NumericStatus } from '../constants/base-enum.const';

// 查询列表参数
export class FindAllDto {
  @ApiPropertyOptional({ description: '页数', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly pageNum?: number;

  @ApiPropertyOptional({ description: '条数', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly pageSize?: number;

  @ApiPropertyOptional({
    description: '是否分页',
    default: NumericStatus.True,
    enum: NumericStatus,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(NumericStatus)
  @IsNumber()
  readonly isPaging?: NumericStatus;

  @ApiPropertyOptional({
    description: 'id列表',
    type: 'array',
    items: { type: 'number' },
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @ArrayNotEmpty({ message: 'id列表不能为空' })
  readonly ids?: number[];
}

// 文件上传参数
export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsNotEmpty({ message: '文件不能为空' })
  readonly file: Express.Multer.File;
}

// 写入文件参数
export class WriteFileDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: '文件路径',
  })
  @IsNotEmpty({ message: '文件路径不能为空' })
  readonly path: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: '文件名',
  })
  @IsNotEmpty({ message: '文件名不能为空' })
  @IsByteLength(0, DataLength.Long)
  readonly filename: string;
}

// ids提交参数
export class IdsDto {
  @ApiProperty({
    description: 'id列表',
    type: 'array',
    items: { type: 'number' },
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'id列表不能为空' })
  readonly ids: number[];
}

// 邮箱号参数
export class AccountDto {
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly account: string;
}

// socket响应参数
export class SocketResDto {
  @ApiProperty({ description: '发送方id', required: true })
  send_uid: number;

  @ApiPropertyOptional({ description: '会话uuid' })
  session_id?: string;

  @ApiPropertyOptional({ description: '消息id' })
  MsgId?: number;

  @ApiPropertyOptional({ description: '是否是重发' })
  isReSend?: boolean;
}
