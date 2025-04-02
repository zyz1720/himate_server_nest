import { Query, Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountDto } from 'src/commom/dto/commom.dto';

@ApiTags('验证码')
@ApiBearerAuth()
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: '获取验证码' })
  @Public()
  @Get('code')
  async loginCode(@Query() query: AccountDto) {
    const { account } = query || {};
    return this.mailService.seedUserCode(account);
  }
}
