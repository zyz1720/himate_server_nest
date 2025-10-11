import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/* boolean字符串转换管道，暂不使用 */
@Injectable()
export class BooleanFromStringPipe implements PipeTransform {
  private readonly booleanKeys = [
    'isPaging',
    'isFindMusic',
    'ekey',
    'isParser',
  ];

  transform(value: any) {
    for (const key of this.booleanKeys) {
      if (key in value) {
        const strValue = value[key];
        if (strValue === 'true' || strValue === 'false') {
          value[key] = strValue === 'true';
          return value;
        }
        throw new BadRequestException(
          `Invalid value for ${key} boolean conversion`,
        );
      }
    }
    return value;
  }
}
