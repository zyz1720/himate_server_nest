import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DataLength } from 'src/common/constants/database-enum.const';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { StringUtil } from 'src/common/utils/string.util';

// 枚举定义
export enum MateStatusEnum {
  agreed = 'agreed',
  waiting = 'waiting',
  refused = 'refused',
}

@Entity('mate')
@Index('idx_mate_user_id', ['user_id', 'mate_status'])
@Index('idx_mate_friend_id', ['friend_id', 'mate_status'])
@Index('idx_mate_id_user', ['mate_id', 'user_id'])
@Index('idx_mate_id_friend', ['mate_id', 'friend_id'])
export class MateEntity {
  @ApiProperty({ description: '好友自增id' })
  @PrimaryGeneratedColumn({ comment: '好友自增id' })
  id: number;

  @ApiProperty({ description: '好友uuid' })
  @Index('idx_mate_mate_id_unique', { unique: true })
  @Column({ comment: '好友uuid', length: DataLength.UUID })
  mate_id: string;

  @ApiProperty({ description: '用户id' })
  @Column({ type: 'int', comment: '用户id' })
  user_id: number;

  @ApiProperty({ description: '好友对用户的备注' })
  @Column({
    comment: '好友对用户的备注',
    length: DataLength.Medium,
    nullable: true,
  })
  user_remarks: string;

  @ApiProperty({ description: '好友id' })
  @Column({ type: 'int', comment: '好友id' })
  friend_id: number;

  @ApiProperty({ description: '用户对好友的备注' })
  @Column({
    comment: '用户对好友的备注',
    length: DataLength.Medium,
    nullable: true,
  })
  friend_remarks: string;

  @ApiProperty({ description: '好友状态' })
  @Column({
    type: 'enum',
    comment: '好友状态',
    enum: MateStatusEnum,
    default: 'waiting',
  })
  mate_status: string;

  @ApiProperty({ description: '验证消息' })
  @Column({ comment: '验证消息', length: DataLength.Longer, nullable: true })
  validate_msg: string;

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
  @Index('idx_mate_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'friend_id' })
  friend: UserEntity;

  @BeforeInsert()
  createGroupUUID() {
    this.mate_id = StringUtil.createUUID();
  }
}
