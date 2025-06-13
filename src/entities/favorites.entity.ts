import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { musicEntity } from './music.entity';
import {
  NumericStatus,
  DataLength,
} from 'src/commom/constants/base-enum.const';

@Entity('favorites')
export class favoritesEntity {
  @PrimaryGeneratedColumn({ comment: '文件自增id' })
  id: number;

  @Column({ type: 'int', comment: '群组所属用户id' })
  creator_uid: number;

  @Column({ length: DataLength.Medium, comment: '创建者昵称' })
  creator_name: string;

  @Column({ length: DataLength.Long, comment: '创建者头像' })
  creator_avatar: string;

  @Column({ length: DataLength.Long, comment: '收藏夹名' })
  favorites_name: string;

  @Column({
    length: DataLength.Long,
    comment: '收藏夹封面',
    default: 'default_favorites_cover.jpg',
  })
  favorites_cover: string;

  @Column({
    type: 'text',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    default: null,
    comment: '收藏夹描述',
  })
  favorites_remark: string;

  @Column({
    type: 'tinyint',
    comment: '是否公开(0:私密, 1:公开)',
    default: NumericStatus.False,
  })
  is_public: number;

  @Column({
    type: 'tinyint',
    comment: '是否是默认收藏夹(0:否, 1:是)',
    default: NumericStatus.False,
  })
  is_default: number;

  @ManyToMany(() => musicEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinTable()
  music: musicEntity[];

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
