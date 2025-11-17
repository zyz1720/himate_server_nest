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
import { I18nContext } from 'nestjs-i18n';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    Logger.error(exception?.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const message =
      I18nContext.current().t('message.DATA_OPERATION_FAILED') +
      (exception?.code || exception?.message || exception?.name);

    response
      .status(HttpStatus.BAD_REQUEST)
      .send(ApiResponse.fail(CommonUtil.getFilterMsg(message)));
  }
}
