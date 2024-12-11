import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { isResultMsg } from '../utils/base';
import { ResultMsg } from '../utils/result';
import { Msg } from '../constants/base-msg.const';

export interface Response<T> {
  data: T;
}
@Injectable()
export class HttpReqTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((result) => {
        if (result) {
          return isResultMsg(result) ? result : ResultMsg.ok('成功', result);
        } else {
          return ResultMsg.fail(Msg.DATA_NOEXIST);
        }
      }),
    );
  }
}
