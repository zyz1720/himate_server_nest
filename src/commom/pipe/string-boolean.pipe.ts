import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BooleanFromStringPipe implements PipeTransform {
  transform(value: any) {
    if ('isPaging' in value) {
      const { isPaging } = value;
      if (
        typeof isPaging === 'string' &&
        (isPaging === 'true' || isPaging === 'false')
      ) {
        value.isPaging = isPaging === 'true';
        return value;
      }
      throw new BadRequestException('Invalid value for boolean conversion');
    }
    if ('isFindMusic' in value) {
      const { isFindMusic } = value;
      if (
        typeof isFindMusic === 'string' &&
        (isFindMusic === 'true' || isFindMusic === 'false')
      ) {
        value.isFindMusic = isFindMusic === 'true';
        return value;
      }
      throw new BadRequestException('Invalid value for boolean conversion');
    }
    if ('isForce' in value) {
      const { isForce } = value;
      if (
        typeof isForce === 'string' &&
        (isForce === 'true' || isForce === 'false')
      ) {
        value.isForce = isForce === 'true';
        return value;
      }
      throw new BadRequestException('Invalid value for boolean conversion');
    }
    return value;
  }
}
