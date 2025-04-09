// 会话类型枚举
export enum ChatType {
  Personal = 'personal',
  Group = 'group',
}

// 消息类型枚举
export enum MessageType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Other = 'other',
}

// 消息状态枚举
export enum MessageStatus {
  Read = 'read',
  Unread = 'unread',
}

// 文件使用类型枚举
export enum FileUseType {
  User = 'user',
  Chat = 'chat',
  Group = 'group',
  System = 'system',
  Music = 'music',
  Upload = 'upload',
  Unknown = 'unknown',
}

// 群成员角色枚举
export enum GroupMemberRole {
  Admin = 'admin',
  Owner = 'owner',
  Member = 'member',
}

// 群/群成员状态枚举
export enum MemberStatus {
  Forbidden = 'forbidden',
  Normal = 'normal',
}

// 好友关系状态枚举
export enum MateStatus {
  Agreed = 'agreed',
  Waiting = 'waiting',
  Refused = 'refused',
}

// 用户性别枚举
export enum Gender {
  Man = 'man',
  Woman = 'woman',
  Unknown = 'unknown',
}

// 状态枚举
export enum NumericStatus {
  True = 1,
  False = 0,
}

// 用户权限枚举
export enum Role {
  User = 'default',
  Admin = 'admin',
  VIP = 'vip',
}
