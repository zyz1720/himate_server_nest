import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CalculateUtil } from 'src/common/utils/calculate.util';
import { StringUtil } from 'src/common/utils/string.util';
import {
  Gender,
  Role,
  Status,
  DataLength,
} from 'src/common/constants/database-enum.const';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
@Index('idx_user_id_user_name_avatar', ['id', 'user_name', 'user_avatar'])
export class UserEntity {
  @ApiProperty({ description: '用户id' })
  @PrimaryGeneratedColumn({ comment: '用户id' })
  id: number;

  @ApiProperty({ description: '用户名' })
  @Column({ length: DataLength.Medium, default: '普通用户', comment: '用户名' })
  user_name: string;

  @ApiProperty({ description: '用户头像' })
  @Column({ length: DataLength.Long, nullable: true, comment: '用户头像' })
  user_avatar: string;

  @ApiProperty({ description: '用户背景图' })
  @Column({ length: DataLength.Long, nullable: true, comment: '用户背景图' })
  user_bg_img: string;

  @ApiProperty({ description: '性别' })
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Unknown,
    comment: '性别',
  })
  sex: string;

  @ApiProperty({ description: '生日' })
  @Column({ type: 'timestamp', nullable: true, comment: '生日' })
  birthday: Date;

  @ApiProperty({ description: '年龄' })
  @Column({ type: 'tinyint', comment: '年龄', default: 0 })
  age: number;

  @ApiProperty({ description: '账号' })
  @Column({ length: DataLength.Medium, comment: '账号' })
  account: string;

  @ApiProperty({ description: '自定义账号' })
  @Column({ length: DataLength.Medium, comment: '自定义账号' })
  self_account: string;

  @ApiProperty({ description: '用户权限' })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
    comment: '用户权限',
  })
  user_role: Role;

  // 查询时隐藏密码
  @Exclude()
  @Column({ length: DataLength.HASH, select: false, comment: '用户密码' })
  password: string;

  @ApiProperty({ description: '用户状态' })
  @Column({
    type: 'enum',
    enum: Status,
    comment: '用户状态(enabled:正常 disabled:禁用)',
    default: Status.Enabled,
  })
  user_status: Status;

  @ApiProperty({ description: '创建者id' })
  @Column({ type: 'int', comment: '创建者id' })
  create_by: number;

  @ApiProperty({ description: '修改者id' })
  @Column({ type: 'int', comment: '修改者id' })
  update_by: number;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;

  @ApiProperty({ description: '删除时间' })
  @Index('idx_user_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @BeforeInsert()
  initUserInfo() {
    this.password = StringUtil.encryptStr(this.password);
    this.self_account = 'mate_' + StringUtil.createUUID().slice(0, 8);
  }

  @BeforeUpdate()
  updateAge() {
    this.age = CalculateUtil.calculateAge(this.birthday);
  }
}
