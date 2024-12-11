import { Query, Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@ApiTags('验证码')
@ApiBearerAuth()
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: '获取验证码' })
  @Roles(Role.Public)
  @Get('code')
  async loginCode(@Query() query: CreateUserDto) {
    const { account } = query || {};
    return this.mailService.seedUserCode(account);
  }
}
