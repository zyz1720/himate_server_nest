import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { TypeUtil } from '../utils/type.util';
import { Response } from '../response/api-response';
import { I18nContext } from 'nestjs-i18n';

export interface IResponse<T> {
  data: T;
}
@Injectable()
export class HttpReqTransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((result) => {
        if (result) {
          return TypeUtil.isResponse(result)
            ? result
            : Response.ok(
                I18nContext.current().t('message.OPERATE_SUCCESS'),
                result,
              );
        } else {
          return Response.fail(
            I18nContext.current().t('message.OPERATE_ERROR'),
          );
        }
      }),
    );
  }
}
