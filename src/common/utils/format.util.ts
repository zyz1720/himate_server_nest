export class FormatUtil {
  /**
   * 格式化分组查询数据
   * @param originalData 原始数据对象
   * @param startsWithStr 前缀字符串，用于筛选需要格式化的键
   * @returns 格式化后的新数据对象
   */
  static formatGroupQueryData(originalData: any, startsWithStr: string): any {
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
  }

  /**
   * 格式化时间格式为 YYYY/MM/DD  HH:mm:ss
   * @param time 时间字符串
   * @returns 格式化后的时间字符串
   */
  static formatTime(time?: string): string {
    const timeObj = time ? new Date(time) : new Date();

    // 获取年月日时分秒
    const year = timeObj.getFullYear();
    const month = String(timeObj.getMonth() + 1).padStart(2, '0');
    const day = String(timeObj.getDate()).padStart(2, '0');
    const hours = String(timeObj.getHours()).padStart(2, '0');
    const minutes = String(timeObj.getMinutes()).padStart(2, '0');
    const seconds = String(timeObj.getSeconds()).padStart(2, '0');

    // 按照YYYY/MM/DD HH:mm:ss格式拼接
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 格式化日期格式为 YYYY/MM/DD
   * @param time 时间字符串
   * @returns 格式化后的时间字符串
   */
  static formatDate(time?: string): string {
    const timeObj = time ? new Date(time) : new Date();

    // 获取年月日
    const year = timeObj.getFullYear();
    const month = String(timeObj.getMonth() + 1).padStart(2, '0');
    const day = String(timeObj.getDate()).padStart(2, '0');

    // 按照YYYY/MM/DD格式拼接
    return `${year}/${month}/${day}`;
  }
}
