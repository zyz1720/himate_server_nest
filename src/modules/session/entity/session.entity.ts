import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DataLength } from 'src/common/constants/database-enum.const';
import { MessageEntity } from 'src/modules/message/entity/message.entity';

// 枚举定义
export enum ChatTypeEnum {
  private = 'private',
  group = 'group',
}

@Entity('session')
export class SessionEntity {
  @ApiProperty({ description: '会话自增id' })
  @PrimaryGeneratedColumn({ comment: '会话自增id' })
  id: number;

  @ApiProperty({ description: '会话uuid' })
  @Index('idx_session_session_id')
  @Column({ comment: '会话uuid', length: DataLength.UUID })
  session_id: string;

  @ApiProperty({ description: '最后一条消息的id' })
  @Index('idx_session_last_msg_id')
  @Column({ type: 'int', comment: '最后一条消息的id', nullable: true })
  last_msg_id: number;

  @ApiProperty({ description: '会话类型' })
  @Index('idx_session_chat_type')
  @Column({ type: 'enum', comment: '会话类型', enum: ChatTypeEnum })
  chat_type: ChatTypeEnum;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @ApiProperty({ description: '更新时间' })
  @Index('idx_session_update_time')
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;

  @ApiProperty({ description: '创建者id' })
  @Column({ type: 'int', comment: '创建者id' })
  create_by: number;

  @ApiProperty({ description: '修改者id' })
  @Column({ type: 'int', comment: '修改者id' })
  update_by: number;

  @ApiProperty({ description: '删除时间' })
  @Index('idx_session_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @OneToOne(() => MessageEntity)
  @JoinColumn({ name: 'last_msg_id' })
  lastMsg: MessageEntity;

  @OneToMany(() => MessageEntity, (messages) => messages.session)
  messages: MessageEntity[];
}
