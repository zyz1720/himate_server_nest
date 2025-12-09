import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SseService } from './sse.service';
import { ApiOkMsgRes } from 'src/common/response/api-response.decorator';
import { I18nService } from 'nestjs-i18n';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { Observable, interval, map } from 'rxjs';

@ApiTags('common - SSE')
@ApiBearerAuth()
@Controller('sse')
export class SseController {
  constructor(
    private readonly sseService: SseService,
    private readonly i18n: I18nService,
  ) {}

  @ApiOperation({ summary: '推送未读消息' })
  @ApiOkMsgRes()
  @Sse('unread')
  pushUnread(@UserId() uid: number): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((count) => ({
        data: {
          message: `Hello from SSE! Count: ${count} ${uid}`,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}
