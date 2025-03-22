import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

/* 添加音乐DTO */
export class AddMusicDto {
  @ApiProperty({
    description: '歌曲文件路径',
    required: true,
  })
  @IsNotEmpty({ message: '歌曲文件路径不能为空' })
  @IsString()
  readonly file_path: string;

  @ApiProperty({
    description: '文件名称',
    required: true,
  })
  @IsNotEmpty({ message: '文件名称不能为空' })
  @IsString()
  readonly file_name: string;

  @ApiProperty({
    description: '文件大小',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty({ message: '文件大小不能为空' })
  readonly file_size: number;

  @ApiProperty({
    description: '上传用户id',
    required: true,
  })
  @IsNotEmpty({ message: '上传用户id不能为空' })
  @IsNumber()
  readonly upload_uid: number;
}

/* 添加音乐收藏夹DTO */
export class AddMusicFavoritesDto {
  @ApiProperty({
    description: '创建者id',
    required: true,
  })
  @IsNotEmpty({ message: '创建者id不能为空' })
  @IsNumber()
  readonly creator_uid: number;

  @ApiProperty({
    description: '收藏夹名',
    required: true,
  })
  @IsNotEmpty({ message: '收藏夹名不能为空' })
  @IsString()
  readonly favorites_name: string;
}
