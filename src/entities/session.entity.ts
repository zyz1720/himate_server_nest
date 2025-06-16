import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { chatEntity } from './chat.entity';
import { mateEntity } from './mate.entity';
import { groupEntity } from './group.entity';
import {
  MessageType,
  ChatType,
  DataLength,
} from 'src/commom/constants/base-enum.const';

@Entity('session')
export class sessionEntity {
  @PrimaryGeneratedColumn({ comment: '会话自增id' })
  id: number;

  @Index()
  @Column({ length: DataLength.UUID, comment: '会话id(好友id或群组id)' })
  session_id: string;

  @Column({ type: 'int', comment: '创建者id' })
  creator_uid: number;

  @Column({
    length: DataLength.Medium,
    default: null,
    comment: '用户设备唯一id',
  })
  device_id: string;

  @Column({
    type: 'text',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    default: null,
    comment: '最后一条消息',
  })
  last_msg: string;

  @Column({
    type: 'int',
    default: null,
    comment: '最后一条消息的id',
  })
  last_msgId: number;

  @Column({ type: 'int', default: null, comment: '发送最后一条消息用户的id' })
  last_msgUid: number;

  @Column({
    length: DataLength.Long,
    default: null,
    comment: '最后一条消息的秘钥',
  })
  last_msgSecret: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.Text,
    comment: '最后的消息类型',
  })
  last_msgType: string;

  @Column({
    type: 'enum',
    enum: ChatType,
    comment: '会话类型',
  })
  chat_type: string;

  @Column({ type: 'int', default: 0, comment: '会话未读数' })
  unread_count: number;

  @OneToMany(() => chatEntity, (msgs) => msgs.session)
  msgs: chatEntity[];

  @OneToOne(() => mateEntity, {
    createForeignKeyConstraints: false, // 取消联合主键约束
  })
  @JoinColumn()
  mate: mateEntity;

  @OneToOne(() => groupEntity, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  group: groupEntity;

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
}
