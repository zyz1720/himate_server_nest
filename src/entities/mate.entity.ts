import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MateStatus, DataLength } from 'src/common/constants/base-enum.const';
import { createUUID } from 'src/common/utils/base';

@Entity('mate')
export class mateEntity {
  @PrimaryGeneratedColumn({ comment: '好友自增id' })
  id: number;

  @Index({ unique: true })
  @Column({ length: DataLength.UUID, comment: '随机好友id' })
  mate_id: string;

  @Column({ type: 'int', comment: '申请用户id' })
  apply_uid: number;

  @Column({ length: DataLength.Medium, comment: '同意者给申请人的备注' })
  apply_remark: string;

  @Column({ length: DataLength.Long, comment: '申请人头像' })
  apply_avatar: string;

  @Column({ type: 'int', comment: '同意用户id' })
  agree_uid: number;

  @Column({ length: DataLength.Medium, comment: '申请人给同意者的备注' })
  agree_remark: string;

  @Column({ length: DataLength.Long, comment: '同意者头像' })
  agree_avatar: string;

  @Column({ length: DataLength.Longer, default: null, comment: '验证消息' })
  validate_msg: string;

  @Column({
    type: 'enum',
    enum: MateStatus,
    default: MateStatus.Waiting,
    comment: '好友状态',
  })
  mate_status: string;

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
  createMateUUID() {
    this.mate_id = createUUID();
  }
}
