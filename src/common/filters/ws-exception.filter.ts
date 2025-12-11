import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Response as ApiResponse } from '../response/api-response';
import { CommonUtil } from '../utils/common.util';
import { WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    const error = exception.getError();
    console.log('exception error', error);

    client.emit(
      'error',
      ApiResponse.fail(CommonUtil.getFilterFailedMsg(error)),
    );
  }
}
