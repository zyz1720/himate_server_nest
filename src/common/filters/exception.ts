import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getFilterMsg } from '../utils/base';

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const res = exception.getResponse();

    response.status(status).json({
      code: status,
      message: getFilterMsg(res),
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      success: false,
    });
  }
}
