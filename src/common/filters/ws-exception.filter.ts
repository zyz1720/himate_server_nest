import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { Response as ApiResponse } from '../response/api-response';
import { CommonUtil } from '../utils/common.util';

@Catch(HttpException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    const response = exception.getResponse();

    client.emit(
      'error',
      ApiResponse.fail(CommonUtil.getFilterFailedMsg(response)),
    );
  }
}
