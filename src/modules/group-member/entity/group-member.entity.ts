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
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DataLength } from 'src/common/constants/database-enum.const';
import { GroupEntity } from 'src/modules/group/entity/group.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';

// 枚举定义
export enum MemberRoleEnum {
  admin = 'admin',
  owner = 'owner',
  member = 'member',
}

export enum MemberNormalRoleEnum {
  admin = 'admin',
  member = 'member',
}

export enum MemberStatusEnum {
  forbidden = 'forbidden',
  normal = 'normal',
}

@Entity('group_member')
export class GroupMemberEntity {
  @ApiProperty({ description: '群成员表自增id' })
  @PrimaryGeneratedColumn({ comment: '群成员表自增id' })
  id: number;

  @ApiProperty({ description: '关联群组id' })
  @Column({ type: 'int', comment: '关联群组id' })
  group_primary_id: number;

  @ApiProperty({ description: '群组uuid' })
  @Index('idx_group_member_group_id')
  @Column({ comment: '群组uuid', length: DataLength.UUID })
  group_id: string;

  @ApiProperty({ description: '用户id' })
  @Index('idx_group_member_user_id')
  @Column({ type: 'int', comment: '用户id' })
  user_id: number;

  @ApiProperty({ description: '群成员备注' })
  @Column({ comment: '群成员备注', length: DataLength.Medium })
  member_remarks: string;

  @ApiProperty({ description: '群成员权限' })
  @Column({
    type: 'enum',
    comment: '群成员权限',
    enum: MemberRoleEnum,
    default: 'member',
  })
  member_role: string;

  @ApiProperty({ description: '群成员状态' })
  @Column({
    type: 'enum',
    comment: '群成员状态',
    enum: MemberStatusEnum,
    default: 'normal',
  })
  member_status: string;

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
  @Column({ type: 'int', comment: '修改者id', nullable: true })
  update_by: number;

  @ApiProperty({ description: '删除时间' })
  @Index('idx_group_member_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @ManyToOne(() => GroupEntity, (group) => group.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_primary_id' })
  @Index('idx_group_member_group_primary_id')
  group: GroupEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
