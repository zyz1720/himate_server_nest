import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { basename, extname } from 'path';

export class StringUtil {
  /**
   * 加密密码
   * @param password 要加密的密码字符串
   * @returns 加密后的密码字符串
   */
  static encryptStr(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  /**
   * 生成uuid
   * @returns 生成的uuid字符串
   */
  static createUUID(): string {
    return uuidv4();
  }

  /**
   * 生成随机指定长度数字
   * @param num 要生成的随机数字的长度，默认值为6
   * @returns 生成的随机数字字符串
   */
  static createRandomNumber(num: number = 6): string {
    // 使用 crypto 模块生成更安全的随机数
    const randomNum = parseInt(
      randomBytes(Math.ceil(num / 2)).toString('hex'),
      16,
    );
    const code = (randomNum % Math.pow(10, num)).toString().padStart(num, '0');
    return code;
  }

  /**
   * 生成随机指定长度字符串
   * @param num 要生成的随机字符串的长度，默认值为6
   * @returns 生成的随机字符串
   */
  static createRandomString(num: number = 6): string {
    const randomStr = randomBytes(num).toString('base64');
    return randomStr.slice(0, num);
  }

  /**
   * 从URL中提取文件名
   * @param url 包含文件名的URL字符串
   * @returns 提取出的文件名字符串
   */
  static getFileNameFromUrl(url: string): string {
    if (typeof url !== 'string' || !url.trim()) return '';
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;

      // 使用path模块的basename方法获取文件名
      return basename(pathname);
    } catch (e) {
      // 如果URL解析失败，回退到简单方法
      const urlWithoutParams = url.split('?')[0].split('#')[0];
      return basename(urlWithoutParams || '');
    }
  }

  /**
   * 从文件名中提取文件扩展名
   * @param fileName 包含扩展名的文件名字符串
   * @returns 提取出的文件扩展名字符串
   */
  static getFileExtension(fileName: string): string {
    if (typeof fileName !== 'string' || !fileName.trim()) return '';
    try {
      const parsedUrl = new URL(fileName);
      const pathname = parsedUrl.pathname;

      // 使用path模块的extname方法获取文件扩展名
      return extname(pathname);
    } catch (e) {
      // 如果URL解析失败，回退到简单方法
      const fileNameWithoutParams = fileName.split('?')[0].split('#')[0];
      return extname(fileNameWithoutParams || '');
    }
  }
}
