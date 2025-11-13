import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('group')
export class GroupEntity {
  @ApiProperty({ description: '群组自增id' })
  @PrimaryGeneratedColumn({ comment: '群组自增id' })
  id: number;

  @ApiProperty({ description: '群组uuid' })
  @Index('idx_group_group_id_unique', { unique: true })
  @Column({ comment: '群组uuid', length: 36 })
  group_id: string;

  @ApiProperty({ description: '群组名称' })
  @Column({ comment: '群组名称', length: 48, nullable: true })
  group_name: string;

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
  @Index('idx_group_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @ApiProperty({ description: '群组头像' })
  @Column({
    comment: '群组头像',
    length: 120,
    default: 'default_assets/default_group_avatar.jpg',
  })
  group_avatar: string;

  @ApiProperty({ description: '群组简介' })
  @Column({ type: 'text', comment: '群组简介', nullable: true })
  group_introduce: string;
}
