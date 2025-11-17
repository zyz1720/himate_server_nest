import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/common/dto/common.dto';

export class FindMusicUrlDto {
  @ApiProperty({
    description: '歌曲id',
    required: true,
  })
  @IsNotEmpty({ message: '歌曲id不能为空' })
  readonly id: string;

  @ApiPropertyOptional({
    description: '音质 (0-16)',
    default: 14,
  })
  @IsOptional()
  readonly quality?: number;

  @ApiPropertyOptional({
    description: '歌曲类型 (0或1 常规歌曲 111	华语群星 112	铃声 113	伴奏)',
    default: 0,
  })
  @IsOptional()
  readonly type?: number;

  @ApiPropertyOptional({
    description: '是否获取加密的音乐链接',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  readonly ekey?: boolean;
}

export class SearchMusicApiDto extends FindAllDto {
  @ApiProperty({
    description: '歌曲名称',
    required: true,
  })
  @IsNotEmpty({ message: '歌曲名称不能为空' })
  readonly word: string;
}
