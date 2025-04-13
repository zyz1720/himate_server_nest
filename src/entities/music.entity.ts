import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { favoritesEntity } from './favorites.entity';
import { musicMoreEntity } from './music-more.entity';

@Entity('music')
export class musicEntity {
  @PrimaryGeneratedColumn({ comment: '音乐自增id' })
  id: number; // 标记为主列，值自动生成

  @Column({ length: 96, comment: '文件名' })
  file_name: string;

  @Column({ type: 'int', comment: '文件大小' })
  file_size: number;

  @Column({ type: 'int', comment: '上传者id' })
  upload_uid: number;

  @Column({ type: 'int', default: null, comment: '采样率' })
  sampleRate: number;

  @Column({ type: 'int', default: null, comment: '比特率' })
  bitrate: number;

  @Column({ type: 'int', default: null, comment: '音乐时长' })
  duration: number;

  @Column({ length: 96, comment: '音乐名称' })
  title: string;

  @Column({ length: 96, default: null, comment: '音乐艺术家' })
  artist: string;

  @Column({ type: 'json', default: null, comment: '音乐艺术家集合' })
  artists: Array<string>;

  @Column({ length: 96, default: null, comment: '专辑名' })
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

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;
}
