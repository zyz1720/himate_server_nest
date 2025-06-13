import { Query, Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountDto } from 'src/commom/dto/commom.dto';
import { Public } from '../auth/auth.decorator';

@ApiTags('验证码')
@ApiBearerAuth()
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: '获取验证码' })
  @Public()
  @Get('code')
  async loginCode(@Query() query: AccountDto) {
    return this.mailService.seedUserCode(query);
  }
}
