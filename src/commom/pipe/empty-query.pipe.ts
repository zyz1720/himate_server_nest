// empty-query.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class EmptyQueryPipe implements PipeTransform {
  transform(value: any) {
    if (Object.keys(value).length == 0) {
      throw new BadRequestException('参数不能为空');
    }
    return value;
  }
}
