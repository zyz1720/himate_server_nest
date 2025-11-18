import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from 'src/modules/message/entity/message.entity';

// 枚举定义
@Entity('message_read_records')
@Unique('idx_message_read_records_user_id', ['user_id', 'message_id'])
export class MessageReadRecordsEntity {
  @ApiProperty({ description: '消息读取记录自增id' })
  @PrimaryGeneratedColumn({ comment: '消息读取记录自增id' })
  id: number;

  @ApiProperty({ description: '用户id' })
  @Column({ type: 'int', comment: '用户id' })
  user_id: number;

  @ApiProperty({ description: '消息id' })
  @Column({ type: 'int', comment: '消息id' })
  message_id: number;

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
  @Index('idx_message_read_records_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @ManyToOne(() => MessageEntity, (message) => message.read_records, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;
}
