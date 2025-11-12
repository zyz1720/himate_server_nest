import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsJWT } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'refresh token',
  })
  @IsNotEmpty()
  @IsJWT()
  refresh_token: string;
}
