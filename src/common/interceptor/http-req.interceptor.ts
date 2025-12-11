import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { TypeUtil } from '../utils/type.util';
import { Response } from '../response/api-response';
import { CommonUtil } from '../utils/common.util';

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
            : Response.ok('Operation successful', result);
        } else {
          return Response.fail(CommonUtil.getFilterFailedMsg(result));
        }
      }),
    );
  }
}
