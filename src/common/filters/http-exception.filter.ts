import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CommonUtil } from '../utils/common.util';
import { Response } from '../response/api-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    Logger.error(exception?.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const result = exception.getResponse();

    response
      .status(status)
      .send(Response.fail(CommonUtil.getFilterFailedMsg(result)));
  }
}
