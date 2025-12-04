import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkPageRes } from 'src/common/response/api-response.decorator';
import { SessionService } from './session.service';
import { SessionEntity } from './entity/session.entity';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { FindAllDto } from 'src/common/dto/common.dto';

@ApiTags('app - 会话')
@ApiBearerAuth()
@Controller('app/session')
export class AppSessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiOperation({ summary: '会话列表' })
  @ApiOkPageRes(SessionEntity)
  @Get()
  findAll(@UserId() uid: number, @Query() query: FindAllDto) {
    return this.sessionService.findAllUserSession(uid, query);
  }
}
