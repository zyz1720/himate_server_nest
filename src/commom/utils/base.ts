import { BinaryLike, createHash } from 'crypto';
import { ResultMsg } from './result';
import { v4 as uuidv4 } from 'uuid';
import { BaseConst } from '../constants/base.const';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import axios from 'axios';

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

/* 为文件生成哈希值 */
export const generateFileHash = (
  filePath: string,
  algorithm: string = 'sha256',
): Promise<string> => {
  return new Promise((resolve) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data as BinaryLike));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (error) => {
      console.log(error);
      resolve(null);
    });
  });
};

/* 下载文件到指定目录 */
export const downloadFile = async (
  url: string,
  outputPath = BaseConst.uploadDir,
): Promise<string> => {
  try {
    // 创建目录（如果不存在）
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 下载文件
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream', // 以流的形式接收数据
    });

    // 文件保存路径
    const fileName = url.split('/').pop();
    const filePath = path.join(outputPath, fileName);

    // 将文件写入指定目录
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve) => {
      writer.on('finish', () => resolve(fileName));
      writer.on('error', (error) => {
        console.log(error);
        resolve(null);
      });
    });
  } catch (error) {
    throw new Error(`文件下载失败: ${error.message}`);
  }
};

/* 延迟x毫秒 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
