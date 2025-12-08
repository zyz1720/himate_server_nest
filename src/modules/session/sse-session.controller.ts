import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkMsgRes } from 'src/common/response/api-response.decorator';
import { SessionService } from './session.service';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { Observable, interval, map } from 'rxjs';

@ApiTags('sse - 会话')
@ApiBearerAuth()
@Controller('sse/session')
export class SseSessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiOperation({ summary: '推送未读消息' })
  @ApiOkMsgRes()
  @Sse('unread')
  findAll(@UserId() uid: number): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((count) => ({
        data: {
          message: `Hello from SSE! Count: ${count}`,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}
