import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { groupEntity } from './group.entity';
import { memberStatus, memberRole } from 'src/commom/constants/base-enum.const';

@Entity('group_member')
export class groupMemberEntity {
  @PrimaryGeneratedColumn({ comment: '群成员表自增id' })
  id: number; // 标记为主列，值自动生成

  @Column({ length: 36, comment: '关联群组id' })
  group_id: string;

  @Index()
  @Column({ type: 'int', comment: '群成员用户id' })
  member_uid: number;

  @Column({ length: 96, comment: '群成员头像' })
  member_avatar: string;

  @Column({ length: 48, comment: '群成员备注' })
  member_remark: string;

  @Column({
    type: 'enum',
    enum: memberRole,
    default: 'member',
    comment: '群成员权限',
  })
  member_role: string;

  @Column({
    type: 'enum',
    enum: memberStatus,
    default: 'normal',
    comment: '群成员状态',
  })
  member_status: string;

  @ManyToOne(() => groupEntity, (group) => group.members, {
    createForeignKeyConstraints: false,
  })
  group: groupEntity;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;
}
