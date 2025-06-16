import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  calculateAge,
  createUUID,
  encryptPassword,
} from 'src/commom/utils/base';
import {
  Gender,
  Role,
  NumericStatus,
  DataLength,
} from 'src/commom/constants/base-enum.const';
import { Exclude } from 'class-transformer';

@Entity('user')
export class userEntity {
  @PrimaryGeneratedColumn({ comment: '用户id' })
  id: number;

  @Column({ length: DataLength.Medium, default: '普通用户', comment: '用户名' })
  user_name: string;

  @Column({
    length: DataLength.Long,
    default: 'default_assets/default_user_avatar.jpg',
    comment: '用户头像',
  })
  user_avatar: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Unknown,
    comment: '性别',
  })
  sex: string;

  @Column({ type: 'timestamp', default: null, comment: '生日' })
  birthday: Date;

  @Column({ type: 'tinyint', default: null, comment: '年龄' })
  age: number;

  @Column({ length: DataLength.Medium, comment: '账号' })
  account: string;

  @Column({ length: DataLength.Medium, comment: '自定义账号' })
  self_account: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
    comment: '用户权限',
  })
  user_role: string;

  // 查询时隐藏密码
  @Exclude()
  @Column({ length: DataLength.HASH, select: false, comment: '用户密码' })
  password: string;

  @Column({
    type: 'tinyint',
    comment: '用户状态(1:正常 0:禁用)',
    default: NumericStatus.True,
  })
  user_status: number;

  @Column({ type: 'int', default: null, comment: '创建者id' })
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
  initUserInfo() {
    this.password = encryptPassword(this.password);
    this.self_account = 'mate_' + createUUID().slice(0, 8);
  }

  @BeforeUpdate()
  updateAge() {
    // 计算年龄
    this.age = calculateAge(this.birthday);
  }
}
