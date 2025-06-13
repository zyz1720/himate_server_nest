import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Msg } from '../constants/base-msg.const';

/* ids转换管道，暂不使用 */
@Injectable()
export class EmptyQueryPipe implements PipeTransform {
  transform(value: any) {
    console.log('value', value);

    const validParams = Object.entries(value)
      .filter(([_, val]) => val !== null && val !== undefined && val !== '')
      .map(([key]) => key);

    if (validParams.length === 0) {
      throw new BadRequestException(
        Object.keys(value).length > 0 ? Msg.PARAMS_ERROR : Msg.PARAMS_EMPTY,
      );
    }

    return value;
  }
}
