import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { musicEntity } from './music.entity';

@Entity('music_more')
export class musicMoreEntity {
  @PrimaryGeneratedColumn({ comment: '音乐扩展信息自增id' })
  id: number; // 标记为主列，值自动生成

  @Index({ unique: true })
  @Column({ type: 'int', comment: '本地音乐id' })
  music_id: number;

  @Column({ length: 16, comment: '匹配第三方音乐id' })
  match_id: string;

  @Column({ length: 96, comment: '音乐名称' })
  music_name: string;

  @Column({ length: 96, comment: '音乐作者' })
  music_singer: string;

  @Column({ length: 96, comment: '专辑名' })
  music_album: string;

  @Column({ length: 96, comment: '音乐封面' })
  music_cover: string;

  @Column({ type: 'text', default: null, comment: '标准歌词' })
  music_lyric: string;

  @Column({ type: 'text', default: null, comment: '翻译歌词' })
  music_trans: string;

  @Column({ type: 'text', default: null, comment: '逐字歌词' })
  music_yrc: string;

  @Column({ type: 'text', default: null, comment: '音译歌词' })
  music_roma: string;

  @OneToOne(() => musicEntity, (music) => music.musicMore, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  music: musicEntity;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;
}
