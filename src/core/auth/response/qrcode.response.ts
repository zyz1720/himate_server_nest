import { ApiProperty } from '@nestjs/swagger';

export class QrCodeResponse {
  @ApiProperty({ description: '二维码ID' })
  qrcode_id: string;

  @ApiProperty({ description: '二维码创建时间' })
  created_at: string;
}
