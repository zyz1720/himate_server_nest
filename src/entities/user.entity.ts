import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CalculateAge,
  createUUID,
  encryptPassword,
} from 'src/commom/utils/base';
import {
  gender,
  userRole,
  numStatus,
} from 'src/commom/constants/base-enum.const';
import { Exclude } from 'class-transformer';

@Entity('user')
export class userEntity {
  @PrimaryGeneratedColumn({ comment: '用户id' })
  id: number; // 标记为主列，值自动生成

  @Column({ length: 48, default: '普通用户', comment: '用户名' })
  user_name: string;

  @Column({
    length: 96,
    default: 'default_user_avatar.jpg',
    comment: '用户头像',
  })
  user_avatar: string;

  @Column({
    type: 'enum',
    enum: gender,
    default: 'unknown',
    comment: '性别',
  })
  sex: string;

  @Column({ type: 'timestamp', default: null, comment: '生日' })
  birthday: Date;

  @Column({ type: 'tinyint', default: null, comment: '年龄' })
  age: number;

  @Column({ length: 48, comment: '账号' })
  account: string;

  @Column({ length: 48, comment: '自定义账号' })
  self_account: string;

  @Column({
    type: 'enum',
    enum: userRole,
    default: 'default',
    comment: '用户权限',
  })
  user_role: string;

  // 查询时隐藏密码
  @Exclude()
  @Column({ length: 200, select: false, comment: '用户密码' })
  password: string;

  @Column({
    type: 'enum',
    enum: numStatus,
    default: 1,
    comment: '用户状态(1:正常 0:禁用)',
  })
  user_status: string;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;

  @BeforeInsert()
  handleUserData() {
    this.password = encryptPassword(this.password);
    this.self_account = 'mate_' + createUUID().slice(0, 8);
  }

  @BeforeUpdate()
  updateAge() {
    // 计算年龄
    this.age = CalculateAge(this.birthday);
  }
}
