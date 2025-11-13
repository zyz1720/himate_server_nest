import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// 枚举定义
export enum MsgTypeEnum {
  text = 'text',
  image = 'image',
  video = 'video',
  audio = 'audio',
  other = 'other',
}

@Entity('message')
@Index('idx_message_session_id', ['session_id', 'id'])
export class MessageEntity {
  @ApiProperty({ description: '消息自增id' })
  @PrimaryGeneratedColumn({ comment: '消息自增id' })
  id: number;

  @ApiProperty({ description: '客户端消息id' })
  @Column({ comment: '客户端消息id', length: 36 })
  client_msg_id: string;

  @ApiProperty({ description: '关联会话uuid' })
  @Column({ comment: '关联会话uuid', length: 36 })
  session_id: string;

  @ApiProperty({ description: '发送方id' })
  @Column({ type: 'int', comment: '发送方id' })
  sender_id: number;

  @ApiProperty({ description: '发送方ip' })
  @Column({ comment: '发送方ip', length: 48, nullable: true })
  sender_ip: string;

  @ApiProperty({ description: '消息内容' })
  @Column({ type: 'text', comment: '消息内容' })
  content: string;

  @ApiProperty({ description: '消息类型' })
  @Column({ type: 'enum', comment: '消息类型', enum: MsgTypeEnum })
  msg_type: MsgTypeEnum;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;

  @ApiProperty({ description: '创建者id' })
  @Column({ type: 'int', comment: '创建者id' })
  create_by: number;

  @ApiProperty({ description: '修改者id' })
  @Column({ type: 'int', comment: '修改者id' })
  update_by: number;

  @ApiProperty({ description: '删除时间' })
  @Index('idx_message_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @ApiProperty({ description: '消息密钥' })
  @Column({ comment: '消息密钥', length: 120, nullable: true })
  msg_secret: string;
}
