import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { groupEntity } from './group.entity';
import {
  MemberStatus,
  GroupMemberRole,
  DataLength,
} from 'src/commom/constants/base-enum.const';

@Entity('group_member')
export class groupMemberEntity {
  @PrimaryGeneratedColumn({ comment: '群成员表自增id' })
  id: number;

  @Index()
  @Column({ length: DataLength.UUID, comment: '关联群组id' })
  group_id: string;

  @Index()
  @Column({ type: 'int', comment: '群成员用户id' })
  member_uid: number;

  @Column({ length: DataLength.Long, comment: '群成员头像' })
  member_avatar: string;

  @Column({ length: DataLength.Medium, comment: '群成员备注' })
  member_remark: string;

  @Column({
    type: 'enum',
    enum: GroupMemberRole,
    default: GroupMemberRole.Member,
    comment: '群成员权限',
  })
  member_role: string;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.Normal,
    comment: '群成员状态',
  })
  member_status: string;

  @ManyToOne(() => groupEntity, (group) => group.members, {
    createForeignKeyConstraints: false,
  })
  group: groupEntity;

  @Column({ type: 'int', comment: '创建者id' })
  create_by: number;

  @Column({ type: 'int', comment: '修改者id' })
  update_by: number;

  @Column({ type: 'int', comment: '删除者id' })
  delete_by: number;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;

  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;
}
