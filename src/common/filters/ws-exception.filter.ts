import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { Response as ApiResponse } from '../response/api-response';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    Logger.error('WebSocket Exception:', exception?.message, exception?.stack);

    const exceptionData = exception.getError();
    const errorMessage =
      typeof exceptionData === 'string' ? exceptionData : 'websocket error';

    client.emit('error', ApiResponse.fail(errorMessage));
  }
}
