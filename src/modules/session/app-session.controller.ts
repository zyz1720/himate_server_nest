import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiOkPageRes,
  ApiOkMsgRes,
} from 'src/common/response/api-response.decorator';
import { SessionService } from './session.service';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { FindAllDto } from 'src/common/dto/common.dto';
import {
  MessageIds,
  MessageWithSenderInfo,
  SessionWithExtra,
} from './types/session-response.type';
import { ReadMessageDto } from './dto/operate-message.dto';

@ApiTags('app - 会话')
@ApiBearerAuth()
@Controller('app/session')
export class AppSessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiOperation({ summary: '会话列表' })
  @ApiOkPageRes(SessionWithExtra)
  @Get()
  findAll(@UserId() uid: number, @Query() query: FindAllDto) {
    return this.sessionService.findAllUserSession(uid, query);
  }

  @ApiOperation({ summary: '会话所有消息' })
  @ApiOkPageRes(MessageWithSenderInfo)
  @Get('/:session_id')
  findAllMsg(
    @UserId() uid: number,
    @Param('session_id') session_id: string,
    @Query() query: FindAllDto,
  ) {
    return this.sessionService.findAllSessionMessages(uid, session_id, query);
  }

  @ApiOperation({ summary: '未读会话id列表' })
  @ApiOkPageRes(MessageIds)
  @Get('unread/:session_id')
  findUnread(
    @UserId() uid: number,
    @Param('session_id') session_id: string,
    @Query() query: FindAllDto,
  ) {
    return this.sessionService.findAllSessionMessageIdsUnread(
      uid,
      session_id,
      query,
    );
  }

  @ApiOperation({ summary: '读取消息' })
  @ApiOkMsgRes()
  @Post('read')
  read(@UserId() uid: number, @Body() data: ReadMessageDto) {
    return this.sessionService.readMessage(uid, data);
  }
}
