import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';
import { MoveTypeEnum } from 'src/common/constants/system-enum.const';

export class MoveFileDto {
  @ApiProperty({ description: '元文件key', required: true })
  @IsNotEmpty()
  @IsString()
  readonly file_key: string;

  @ApiProperty({ description: '移动类型', required: true })
  @IsNotEmpty()
  @IsEnum(MoveTypeEnum)
  readonly move_type: MoveTypeEnum;
}

export class ForceDeleteFileDto {
  @ApiProperty({ description: '元文件key', required: true })
  @IsNotEmpty()
  @IsString()
  readonly file_key: string;

  @ApiProperty({ description: '是否已回收', required: true })
  @IsNotEmpty()
  @IsBoolean()
  readonly is_recycle: boolean;

  @ApiProperty({ description: '是否为图片', required: true })
  @IsNotEmpty()
  @IsBoolean()
  readonly is_image: boolean;
}
