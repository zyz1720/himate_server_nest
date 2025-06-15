import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { musicEntity } from './music.entity';
import { DataLength } from 'src/commom/constants/base-enum.const';

@Entity('music_more')
export class musicMoreEntity {
  @PrimaryGeneratedColumn({ comment: '音乐扩展信息自增id' })
  id: number;

  @Index({ unique: true })
  @Column({ type: 'int', comment: '本地音乐id' })
  music_id: number;

  @Column({ length: DataLength.Short, comment: '匹配第三方音乐id' })
  match_id: string;

  @Column({ length: DataLength.Long, comment: '音乐名称' })
  music_name: string;

  @Column({ length: DataLength.Long, comment: '音乐作者' })
  music_singer: string;

  @Column({ length: DataLength.Long, comment: '专辑名' })
  music_album: string;

  @Column({ length: DataLength.Long, comment: '音乐封面' })
  music_cover: string;

  @Column({ type: 'mediumtext', default: null, comment: '标准歌词' })
  music_lyric: string;

  @Column({ type: 'mediumtext', default: null, comment: '翻译歌词' })
  music_trans: string;

  @Column({ type: 'mediumtext', default: null, comment: '逐字歌词' })
  music_yrc: string;

  @Column({ type: 'mediumtext', default: null, comment: '音译歌词' })
  music_roma: string;

  @OneToOne(() => musicEntity, (music) => music.musicMore, {
    createForeignKeyConstraints: false,
  })
  music: musicEntity;

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
