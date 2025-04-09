import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MateStatus } from 'src/commom/constants/base-enum.const';

@Entity('mate')
export class mateEntity {
  @PrimaryGeneratedColumn({ comment: '好友自增id' })
  id: number; // 标记为主列，值自动生成

  @Index({ unique: true })
  @Column({ length: 36, comment: '随机好友id' })
  mate_id: string;

  @Column({ type: 'int', comment: '申请用户id' })
  apply_uid: number;

  @Column({ length: 48, comment: '同意者给申请人的备注' })
  apply_remark: string;

  @Column({ length: 96, comment: '申请人头像' })
  apply_avatar: string;

  @Column({ type: 'int', comment: '同意用户id' })
  agree_uid: number;

  @Column({ length: 48, comment: '申请人给同意者的备注' })
  agree_remark: string;

  @Column({ length: 96, comment: '同意者头像' })
  agree_avatar: string;

  @Column({ length: 200, default: null, comment: '验证消息' })
  validate_msg: string;

  @Column({
    type: 'enum',
    enum: MateStatus,
    default: MateStatus.Waiting,
    comment: '好友状态',
  })
  mate_status: string;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;
}
