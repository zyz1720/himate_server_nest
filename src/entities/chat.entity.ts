import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { sessionEntity } from './session.entity';
import { createUUID } from 'src/common/utils/base';
import {
  ChatType,
  MessageType,
  MessageStatus,
  DataLength,
} from 'src/common/constants/base-enum.const';

@Entity('chat')
export class chatEntity {
  @PrimaryGeneratedColumn({ comment: '聊天自增id' })
  id: number;

  @Column({ length: DataLength.UUID, comment: '客户端消息id' })
  clientMsg_id: string;

  @Index()
  @Column({ length: DataLength.UUID, comment: '关联生成的会话id' })
  session_id: string;

  @Column({ type: 'int', comment: '发送方id' })
  send_uid: number;

  @Column({ length: DataLength.Medium, default: null, comment: '发送方ip' })
  send_ip: string;

  @Column({
    type: 'text',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    comment: '消息内容',
  })
  msgdata: string;

  @Column({ length: DataLength.Long, default: null, comment: '消息密钥' })
  msg_secret: string;

  @Column({
    type: 'enum',
    enum: ChatType,
    comment: '会话类型',
  })
  chat_type: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    comment: '消息类型',
  })
  msg_type: string;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.Unread,
    comment: '消息状态',
  })
  msg_status: string;

  @ManyToOne(() => sessionEntity, (session) => session.msgs, {
    createForeignKeyConstraints: false, // 取消联合主键约束
  })
  session: sessionEntity;

  @Column({ type: 'int', comment: '创建者id' })
  create_by: number;

  @Column({ type: 'int', default: null, comment: '修改者id' })
  update_by: number;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;

  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @BeforeInsert()
  addClientMsgId() {
    // 生成客户端消息id
    this.clientMsg_id = createUUID();
  }
}
