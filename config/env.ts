import * as fs from 'fs';
import * as path from 'path';

// 定义支持的环境类型
const envTypes = ['local', 'prod', 'test'];

/**
 * 解析环境配置文件路径
 * @returns 返回环境配置文件的路径
 */
function parseEnv(): { path: string } {
  const nodeEnv = process.env.NODE_ENV?.trim(); // 获取 NODE_ENV 环境变量
  let filePath: string | null = null;

  // 如果 NODE_ENV 是支持的环境类型，优先加载对应的 .env 文件
  if (nodeEnv && envTypes.includes(nodeEnv)) {
    const envPath = path.resolve(`.env.${nodeEnv}`);
    if (fs.existsSync(envPath)) {
      filePath = envPath;
    }
  }

  // 如果未指定 NODE_ENV 或对应的 .env 文件不存在，尝试加载默认的 .env 文件
  if (!filePath) {
    const defaultEnv = path.resolve('.env');
    if (fs.existsSync(defaultEnv)) {
      filePath = defaultEnv;
    }
  }

  // 如果仍然没有找到环境配置文件，抛出错误
  if (!filePath) {
    throw new Error(
      `缺少环境配置文件。请确保根目录存在.env文件或指定了有效的NODE_ENV支持的值:${envTypes.join(
        ', ',
      )})`,
    );
  }

  return { path: filePath };
}

export default parseEnv();
