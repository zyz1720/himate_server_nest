/**
 * @description 性别枚举
 * @enum {string}
 * @property {string} Man - 男性
 * @property {string} Woman - 女性
 * @property {string} Unknown - 未知
 */
export enum Gender {
  Man = 'man',
  Woman = 'woman',
  Unknown = 'unknown',
}

/**
 * @description 数值状态枚举
 * @enum {string}
 * @property {string} Y - yes
 * @property {string} N - no
 */
export enum Whether {
  Y = 'yes',
  N = 'no',
}

/**
 * 状态枚举
 * @description 状态枚举
 * @enum {string}
 * @property {string} Enabled - 启用
 * @property {string} Disabled - 禁用
 */
export enum Status {
  Enabled = 'enabled',
  Disabled = 'disabled',
}

/**
 * @description 用户权限枚举
 * @enum {string}
 * @property {string} User - 默认用户
 * @property {string} Admin - 管理员
 * @property {string} VIP - VIP用户
 */
export enum Role {
  User = 'default',
  Admin = 'admin',
  VIP = 'vip',
}

/**
 * @description 数据长度枚举
 * @enum {number}
 * @property {number} Short - 短数据长度
 * @property {number} Medium - 中等数据长度
 * @property {number} Long - 长数据长度
 * @property {number} Longer - 更长数据长度
 * @property {number} UUID - UUID数据长度
 * @property {number} HASH - HASH数据长度
 * @property {number} INT - INT数据长度
 */
export enum DataLength {
  Short = 16,
  Medium = 48,
  Long = 120,
  Longer = 240,
  UUID = 36,
  HASH = 64,
}
