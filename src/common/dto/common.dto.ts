import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { ChatTypeEnum } from 'src/modules/session/entity/session.entity';

export class FindAllDto {
  @ApiPropertyOptional({ description: '页数', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly current?: number;

  @ApiPropertyOptional({ description: '条数', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly pageSize?: number;
}

export class IdsDto {
  @ApiProperty({
    description: 'id列表',
    type: 'array',
    items: { type: 'number' },
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  readonly ids: number[];
}

export class SenderInfoDto {
  @ApiProperty({
    description: '聊天类型',
    type: 'enum',
    enum: ChatTypeEnum,
  })
  @IsNotEmpty()
  chat_type: ChatTypeEnum;

  @ApiProperty({
    description: '用户id',
    type: 'number',
  })
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: '用户备注',
    type: 'string',
  })
  @IsNotEmpty()
  remarks: string;

  @ApiProperty({
    description: '用户头像',
    type: 'string',
  })
  @IsNotEmpty()
  avatar: string;
}
