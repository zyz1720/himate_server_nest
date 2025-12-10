import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SseService } from './sse.service';
import { ApiOkMsgRes } from 'src/common/response/api-response.decorator';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { Observable } from 'rxjs';

@ApiTags('common - SSE')
@ApiBearerAuth()
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @ApiOperation({ summary: '推送未读消息' })
  @ApiOkMsgRes()
  @Sse('unread')
  pushUnread(@UserId() uid: number): Observable<MessageEvent> {
    return this.sseService.createUserConnection(String(uid));
  }
}
