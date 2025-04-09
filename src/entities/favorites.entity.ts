import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { musicEntity } from './music.entity';
import { NumericStatus } from 'src/commom/constants/base-enum.const';

@Entity('favorites')
export class favoritesEntity {
  @PrimaryGeneratedColumn({ comment: '文件自增id' })
  id: number; // 标记为主列，值自动生成

  @Column({ type: 'int', comment: '创建者id' })
  creator_uid: number;

  @Column({ length: 48, comment: '创建者昵称' })
  creator_name: string;

  @Column({ length: 96, comment: '创建者头像' })
  creator_avatar: string;

  @Column({ length: 48, comment: '收藏夹名' })
  favorites_name: string;

  @Column({
    length: 96,
    comment: '收藏夹封面',
    default: 'default_favorites_cover.jpg',
  })
  favorites_cover: string;

  @Column({ length: 200, default: null, comment: '收藏夹描述' })
  favorites_remark: string;

  @Column({
    type: 'enum',
    enum: NumericStatus,
    comment: '是否公开(0:私密, 1:公开)',
    default: NumericStatus.False,
  })
  is_public: string;

  @Column({
    type: 'enum',
    enum: NumericStatus,
    comment: '是否是默认收藏夹(0:否, 1:是)',
    default: NumericStatus.False,
  })
  is_default: string;

  @ManyToMany(() => musicEntity, {
    createForeignKeyConstraints: false,
  })
  @JoinTable()
  music: musicEntity[];

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;
}
