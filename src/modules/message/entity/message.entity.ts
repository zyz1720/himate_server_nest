import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DataLength } from 'src/common/constants/database-enum.const';
import { StringUtil } from 'src/common/utils/string.util';
import { SessionEntity } from 'src/modules/session/entity/session.entity';
import { MessageReadRecordsEntity } from 'src/modules/message-read-records/entity/message-read-records.entity';

// 枚举定义
export enum MsgTypeEnum {
  text = 'text',
  image = 'image',
  video = 'video',
  audio = 'audio',
  file = 'file',
  other = 'other',
}

@Entity('message')
export class MessageEntity {
  @ApiProperty({ description: '消息自增id' })
  @PrimaryGeneratedColumn({ comment: '消息自增id' })
  id: number;

  @ApiProperty({ description: '客户端消息id' })
  @Column({ comment: '客户端消息id', length: DataLength.UUID })
  client_msg_id: string;

  @ApiProperty({ description: '关联会话id' })
  @Column({ type: 'int', comment: '关联会话id' })
  session_primary_id: number;

  @ApiProperty({ description: '发送方id' })
  @Column({ type: 'int', comment: '发送方id' })
  sender_id: number;

  @ApiProperty({ description: '发送方ip' })
  @Column({ comment: '发送方ip', length: DataLength.Medium, nullable: true })
  sender_ip: string;

  @ApiProperty({ description: '消息内容' })
  @Column({ type: 'text', comment: '消息内容' })
  content: string;

  @ApiProperty({ description: '消息类型' })
  @Column({ type: 'enum', comment: '消息类型', enum: MsgTypeEnum })
  msg_type: MsgTypeEnum;

  @ApiProperty({ description: '消息密钥' })
  @Column({ comment: '消息密钥', length: DataLength.Long, nullable: true })
  msg_secret: string;

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

  @ManyToOne(() => SessionEntity, (session) => session.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_primary_id' })
  @Index('idx_message_session_primary_id')
  session: SessionEntity;

  @OneToMany(() => MessageReadRecordsEntity, (records) => records.message)
  read_records: MessageReadRecordsEntity[];

  @BeforeInsert()
  addClientMsgId() {
    // 生成客户端消息id
    this.client_msg_id = StringUtil.createUUID();
  }
}
