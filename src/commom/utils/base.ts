import { createHash } from 'crypto';
import { ResultMsg } from './result';
import { v4 as uuidv4 } from 'uuid';

/* 处理过滤器消息提示 */
export const getFilterMsg = (data: any | string | Array<any>) => {
  if (typeof data === 'string') {
    return data;
  }
  if (data.message && Array.isArray(data.message)) {
    return data.message.join('; ');
  }
  if (typeof data.message === 'string') {
    return data.message;
  }
  return '';
};

/* 判断类是否为返回ResultMsg数据类型 */
export const isResultMsg = (obj: ResultMsg): boolean => {
  const getType = (value: any): string => {
    return typeof value;
  };
  return (
    getType(obj) === 'object' &&
    obj !== null &&
    getType(obj.code) === 'number' &&
    getType(obj.success) === 'boolean' &&
    getType(obj.message) === 'string' &&
    (obj.data === null ||
      typeof obj.data !== 'undefined' ||
      typeof obj.data !== 'function')
  );
};

/* 加密方法 */
export function encryptPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

/* 生成uuid */
export function createUUID(): string {
  return uuidv4();
}

/* 生成随机6位数字 */
export function createRandomNumber(): string {
  const code = (parseInt(String(Math.random() * 1000000)) + 1000000)
    .toString()
    .slice(0, 6);
  return code;
}

/* 计算年龄 */
export function CalculateAge(time: Date): number {
  const nowDate = new Date();
  const nowYear = nowDate.getFullYear();
  const birthDate = new Date(time);
  const birthYear = birthDate.getFullYear();
  const nowAge = nowYear - birthYear;
  return nowAge;
}

/* 格式化分组查询数据 */
export const formatleftJoinData = (
  originalData: any,
  startsWithStr: string,
) => {
  const newData = {};
  for (const key in originalData) {
    if (key.startsWith(startsWithStr)) {
      // 去掉前缀并设置新键名
      const newKey = key.replace(startsWithStr, '');
      newData[newKey] = originalData[key];
    } else {
      // 对于没有 favorites_ 前缀的键，直接复制到新对象
      newData[key] = originalData[key];
    }
  }
  return newData;
};

/* 延迟x毫秒 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
