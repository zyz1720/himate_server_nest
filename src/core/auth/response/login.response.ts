import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  constructor(accessToken: string, refreshToken: string, type: string) {
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
    this.token_type = type;
  }

  @ApiProperty({ description: '访问令牌' })
  access_token: string;

  @ApiProperty({ description: '刷新令牌' })
  refresh_token: string;

  @ApiProperty({ description: '令牌类型', default: 'bearer' })
  token_type: string;
}
