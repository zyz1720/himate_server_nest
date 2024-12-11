// 会话类型枚举
export const chatType = ['personal', 'group'];

// 消息/文件 类型枚举
export const msgType = ['text', 'image', 'video', 'audio', 'other'];

// 消息状态枚举
export const msgStatus = ['read', 'unread'];

// 文件使用类型枚举
export const fileUseType = [
  'user',
  'chat',
  'group',
  'system',
  'music',
  'upload',
  'unknown',
];

// 群成员角色枚举
export const memberRole = ['admin', 'owner', 'member'];

// 群/群成员状态枚举
export const memberStatus = ['forbidden', 'normal'];

// 好友关系状态枚举
export const mateStatus = ['agreed', 'waiting', 'refused'];

// 用户性别枚举
export const gender = ['man', 'woman', 'unknown'];

// 用户角色枚举
export const userRole = ['default', 'admin', 'vip'];

// 删除枚举
export const numStatus = [1, 0];

// 用户权限枚举
export enum Role {
  Public = 'public',
  User = 'user',
  Admin = 'admin',
}
