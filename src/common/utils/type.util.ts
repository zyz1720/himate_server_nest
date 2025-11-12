import { Response } from '../response/api-response';

export class TypeUtil {
  /**
   * 检查值是否为返回ResultMsg数据类型
   * @param value 要检查的值
   * @returns 如果值为返回ResultMsg数据类型则返回 true，否则返回 false
   */
  static isResponse = (obj: Response<any>): boolean => {
    const getType = (value: any): string => {
      return typeof value;
    };
    return (
      getType(obj) === 'object' &&
      obj !== null &&
      getType(obj.code) === 'number' &&
      getType(obj.message) === 'string' &&
      (obj.data === null ||
        typeof obj.data !== 'undefined' ||
        typeof obj.data !== 'function')
    );
  };
}
