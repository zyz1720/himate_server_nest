import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { RefreshTokenDto } from './refresh-token.dto';

export class UserLoginByQrCodeDto extends RefreshTokenDto {
  @ApiProperty({
    description: '二维码ID',
  })
  @IsNotEmpty()
  @IsUUID()
  qrcode_id: string;
}
