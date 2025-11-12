export class CalculateUtil {
  /**
   * 计算年龄
   * @param time 出生日期，格式为YYYY-MM-DD
   * @returns 计算出的年龄
   */
  static calculateAge(time: Date): number {
    const nowDate = new Date();
    const nowYear = nowDate.getFullYear();
    const birthDate = new Date(time);
    const birthYear = birthDate.getFullYear();
    const nowAge = nowYear - birthYear;
    return nowAge;
  }
}
