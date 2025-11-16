import * as fs from 'fs';
import * as crypto from 'crypto';
import * as sharp from 'sharp';
import axios from 'axios';
import { join, dirname } from 'path';
import { writeFile, mkdir, unlink, rename } from 'fs/promises';
import { BinaryLike } from 'crypto';
import { FILE_DIR } from 'config/file_dir';
import { StringUtil } from './string.util';
import { FormatUtil } from './format.util';
import { TypeUtil } from './type.util';
import { Logger } from '@nestjs/common';
import { loadEsm } from 'load-esm';

export class FileUtil {
  /**
   * 写入文件到指定路径
   * @param filePath 文件路径
   * @param fileBuffer 文件内容
   */
  static async writeFileToPath(
    filePath: string,
    fileBuffer: Buffer,
  ): Promise<void> {
    try {
      const fileDir = dirname(filePath);
      await mkdir(fileDir, { recursive: true });
      await writeFile(filePath, fileBuffer);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  /**
   * 生成文件的MD5文件名
   * @param file_name 原始文件名
   * @returns 文件的MD5文件名
   */
  static async generateFileMD5(file_name: string): Promise<string> {
    try {
      const fileExtension = StringUtil.getFileExtension(file_name);
      const md5Hash = crypto.createHash('md5');
      md5Hash.update(file_name + Date.now() + StringUtil.createRandomString());
      return md5Hash.digest('hex') + fileExtension;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  /* 下载文件到指定目录 */
  static async downloadFile(
    url: string,
    outputPath = FILE_DIR.UPLOAD,
  ): Promise<{ filePath: string; fileKey: string; originalName: string }> {
    try {
      // 创建目录（如果不存在）
      const dir = dirname(outputPath);
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
      const fileName = StringUtil.getFileNameFromUrl(url);
      const md5FileName = await FileUtil.generateFileMD5(fileName);

      const fileKey = join(FormatUtil.formatDate(), md5FileName);
      const filePath = join(outputPath, fileKey);

      // 将文件写入指定目录
      const fileDir = dirname(filePath);
      await mkdir(fileDir, { recursive: true });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve) => {
        writer.on('finish', () =>
          resolve({ filePath, fileKey, originalName: fileName || md5FileName }),
        );
        writer.on('error', (error) => {
          console.error(error);
          resolve(null);
        });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  /* 获取文件大小 */
  static async getFileSize(filePath: string): Promise<number> {
    return new Promise((resolve) => {
      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.error(error);
          resolve(0);
        } else {
          const { size } = stats;
          resolve(size || 0);
        }
      });
    });
  }

  /* 为文件生成哈希值 */
  static async generateFileHash(
    filePath: string,
    algorithm: string = 'sha256',
  ): Promise<string> {
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
  }

  /* 删除本地文件 */
  static async deleteLocalFile(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  /* 移动指定文件到另一个目录 */
  static async moveLocalFile(
    filePath: string,
    targetPath: string,
  ): Promise<void> {
    try {
      const fileDir = dirname(targetPath);
      await mkdir(fileDir, { recursive: true });
      await rename(filePath, targetPath);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  /**
   * 生成图片的缩略图
   * @param filePath 图片路径
   * @param fileKey 图片key
   * @returns 缩略图路径或null
   */
  static async generateImageThumbnail(
    filePath: string,
    fileKey: string,
  ): Promise<string | null> {
    try {
      const curPath = join(FILE_DIR.THUMBNAIL, fileKey);
      const fileDir = dirname(curPath);
      await mkdir(fileDir, { recursive: true });
      await sharp(filePath)
        .resize(512, null) // 这里设置压缩尺寸
        .jpeg({ quality: 50 }) // 这里以 jpeg 格式压缩
        .toFile(curPath);
      Logger.log('图片压缩成功:', curPath);
      return curPath;
    } catch (error) {
      Logger.error('压缩图片时发生错误:', error);
      return null;
    }
  }

  /**
   * 获取音乐元数据
   * @param filePath 音乐路径
   * @returns 音乐元数据
   */
  static async getMusicMetadata(filePath: string): Promise<any> {
    try {
      const mm =
        await loadEsm<typeof import('music-metadata')>('music-metadata');
      const metadata = await mm.parseFile(filePath);
      const { duration, sampleRate, bitrate } = metadata.format || {};
      const { title, artist, artists, album } = metadata.common || {};
      const musicForm = {
        title,
        duration: Math.round(duration || 2),
        sample_rate: sampleRate || 0,
        bitrate,
        artist,
        artists,
        album,
      };
      const hasMetadata = TypeUtil.hasMusicMetadata(
        metadata?.format,
        metadata?.common,
      );
      if (hasMetadata) {
        return musicForm;
      }
      return null;
    } catch (error) {
      Logger.error('获取音乐元数据失败', error);
      return null;
    }
  }
}
