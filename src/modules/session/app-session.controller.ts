import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiOkRes,
  ApiOkMsgRes,
  ApiOkPageRes,
} from 'src/common/response/api-response.decorator';
import { SessionService } from './session.service';
import { FindAllSessionDto } from './dto/find-all-session.dto';
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

  @ApiOperation({ summary: '获取会话详情' })
  @ApiOkRes(SessionEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionService.findOneSession(parseInt(id));
  }

  @ApiOperation({ summary: '删除会话' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.softDeleteSession(parseInt(id));
  }
}
