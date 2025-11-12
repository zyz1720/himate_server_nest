import { Query, Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailDto } from './dto/email.dto';
import { Public } from '../auth/decorators/public.decorator';
import { ApiOkMsgRes } from 'src/common/response/api-response.decorator';

@ApiTags('验证码')
@ApiBearerAuth()
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({ summary: '获取验证码' })
  @ApiOkMsgRes()
  @Public()
  @Get('code')
  loginCode(@Query() query: EmailDto) {
    return this.emailService.seedUserCode(query);
  }
}
