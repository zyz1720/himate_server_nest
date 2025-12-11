import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { Response as ApiResponse } from '../response/api-response';
import { CommonUtil } from '../utils/common.util';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    Logger.error(exception?.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message =
      'database operation failed ' + (exception?.message || exception?.name);

    response
      .status(HttpStatus.BAD_REQUEST)
      .send(ApiResponse.fail(CommonUtil.getFilterFailedMsg(message)));
  }
}
