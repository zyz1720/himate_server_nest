import { createHash } from 'crypto';
import { ResultMsg } from './result';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BaseConst } from '../constants/base.const';

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

/* 删除指定文件 */
export function deleteFile(name: string): boolean {
  const uploadPath = BaseConst.uploadDir;

  if (fs.existsSync(uploadPath)) {
    const files = fs.readdirSync(uploadPath); //返回文件和子目录的数组
    if (files.includes(name)) {
      const truePath = path.join(uploadPath, name);
      if (fs.statSync(truePath).isDirectory()) {
        console.log('是文件夹而非文件');
        return false;
      } else {
        fs.unlinkSync(truePath);
        // console.log('删除文件成功' + truePath);
        return true;
      }
    } else {
      console.log('找不到文件夹或目录');
      return false;
    }
  } else {
    console.log('指定目录不存在');
    return false;
  }
}

/* 删除缩略图 */
export function deleteThumbnail(name: string): boolean {
  const compressPath = BaseConst.ThumbnailDir;

  if (fs.existsSync(compressPath)) {
    const files = fs.readdirSync(compressPath); //返回文件和子目录的数组
    if (files.includes(name)) {
      const truePath = path.join(compressPath, name);
      if (fs.statSync(truePath).isDirectory()) {
        console.log('是文件夹而非文件');
        return false;
      } else {
        fs.unlinkSync(truePath);
        // console.log('删除文件成功' + truePath);
        return true;
      }
    } else {
      console.log('找不到文件夹或目录');
      return false;
    }
  } else {
    console.log('指定目录不存在');
    return false;
  }
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
