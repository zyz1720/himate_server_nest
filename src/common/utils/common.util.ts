export class CommonUtil {
  /**
   * 处理过滤器消息提示
   * @param data 要处理的消息数据
   * @returns 处理后的消息字符串
   */
  static getFilterFailedMsg(data: any | string | Array<any>): string {
    if (typeof data == 'string') {
      return data;
    }
    if (data?.message && Array.isArray(data?.message)) {
      return data.message.join('; ');
    }
    if (typeof data?.message == 'string') {
      return data.message;
    }
    return 'failed !';
  }

  /**
   * 延迟x毫秒
   * @param ms 延迟时间，单位毫秒
   * @returns 一个Promise，在延迟时间后resolve
   */
  static delay = (ms: number = 1000) =>
    new Promise((resolve) => setTimeout(resolve, ms));
}
