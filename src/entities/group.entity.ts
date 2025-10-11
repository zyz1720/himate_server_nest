import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
import { groupMemberEntity } from './group-member.entity';
import {
  MemberStatus as GroupStatus,
  DataLength,
} from 'src/common/constants/base-enum.const';
import { createUUID } from 'src/common/utils/base';

@Entity('group')
export class groupEntity {
  @PrimaryGeneratedColumn({ comment: '群组自增id' })
  id: number; // 标记为主列，值自动生成

  @Index({ unique: true })
  @Column({ length: DataLength.UUID, comment: '群组uuid' })
  group_id: string;

  @Column({ type: 'int', comment: '群组所属用户id' })
  creator_uid: number;

  @Column({ length: DataLength.Medium, default: null, comment: '群组名称' })
  group_name: string;

  @Column({
    length: DataLength.Long,
    default: 'default_assets/default_group_avatar.jpg',
    comment: '群组头像',
  })
  group_avatar: string;

  @Column({
    type: 'text',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    default: null,
    comment: '群组简介',
  })
  group_introduce: string;

  @Column({
    type: 'enum',
    enum: GroupStatus,
    default: GroupStatus.Normal,
    comment: '群状态',
  })
  group_status: string;

  @OneToMany(() => groupMemberEntity, (members) => members.group)
  members: groupMemberEntity[];

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
  createGroupUUID() {
    this.group_id = createUUID();
  }
}
