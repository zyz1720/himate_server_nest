import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class MatchMusicApiDto {
  @ApiProperty({ description: '音乐ID', required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly musicId: number;

  @ApiProperty({ description: '匹配ID', required: true })
  @IsNotEmpty()
  @IsString()
  readonly matchId: string;
}
