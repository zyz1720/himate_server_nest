import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { favoritesEntity } from './favorites.entity';
import { musicMoreEntity } from './music-more.entity';
import { DataLength } from 'src/commom/constants/base-enum.const';

@Entity('music')
export class musicEntity {
  @PrimaryGeneratedColumn({ comment: '音乐自增id' })
  id: number;

  @Column({ length: DataLength.Long, comment: '文件名' })
  file_name: string;

  @Column({ type: 'bigint', comment: '文件大小' })
  file_size: number;

  @Column({ type: 'int', comment: '上传者id' })
  upload_uid: number;

  @Column({ type: 'int', default: null, comment: '采样率' })
  sampleRate: number;

  @Column({ type: 'int', default: null, comment: '比特率' })
  bitrate: number;

  @Column({ type: 'int', default: null, comment: '音乐时长' })
  duration: number;

  @Column({ length: DataLength.Long, comment: '音乐名称' })
  title: string;

  @Column({ length: DataLength.Long, default: null, comment: '音乐艺术家' })
  artist: string;

  @Column({ type: 'json', default: null, comment: '音乐艺术家集合' })
  artists: Array<string>;

  @Column({ length: DataLength.Long, default: null, comment: '专辑名' })
  album: string;

  @ManyToMany(() => favoritesEntity, {
    createForeignKeyConstraints: false,
  })
  favorites: favoritesEntity[];

  @OneToOne(() => musicMoreEntity, (musicMore) => musicMore.music, {
    cascade: true, // 启用级联操作
    onDelete: 'CASCADE', // 级联删除
    createForeignKeyConstraints: false, // 禁用外键约束
  })
  @JoinColumn()
  musicMore: musicMoreEntity;

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
}
