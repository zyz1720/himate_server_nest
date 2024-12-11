import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { groupMemberEntity } from './group-member.entity';
import { memberStatus as groupStatus } from 'src/commom/constants/base-enum.const';

@Entity('group')
export class groupEntity {
  @PrimaryGeneratedColumn({ comment: '群组自增id' })
  id: number; // 标记为主列，值自动生成

  @Index()
  @Column({ length: 36, comment: '群组uuid' })
  group_id: string;

  @Column({ type: 'int', comment: '群组所属用户id' })
  creator_uid: number;

  @Column({ length: 48, default: null, comment: '群组名称' })
  group_name: string;

  @Column({
    length: 96,
    default: 'default_group_avatar.jpg',
    comment: '群组头像',
  })
  group_avatar: string;

  @Column({ length: 200, default: null, comment: '群组简介' })
  group_introduce: string;

  @Column({
    type: 'enum',
    enum: groupStatus,
    default: 'normal',
    comment: '群状态',
  })
  group_status: string;

  @OneToMany(() => groupMemberEntity, (members) => members.group)
  members: groupMemberEntity[];

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;
}
