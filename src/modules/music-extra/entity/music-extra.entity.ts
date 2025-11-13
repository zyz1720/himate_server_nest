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

// 枚举定义

@Entity('music_extra')
export class MusicExtraEntity {
  @ApiProperty({ description: '音乐扩展信息自增id' })
  @PrimaryGeneratedColumn({ comment: '音乐扩展信息自增id' })
  id: number;

  @ApiProperty({ description: '音乐id' })
  @Index('idx_music_extra_music_id_unique', { unique: true })
  @Column({ type: 'int', comment: '音乐id' })
  music_id: number;

  @ApiProperty({ description: '第三方音乐id' })
  @Column({ comment: '第三方音乐id', length: 16 })
  match_id: string;

  @ApiProperty({ description: '音乐封面' })
  @Column({ type: 'int', comment: '音乐封面' })
  cover_file_id: number;

  @ApiProperty({ description: '标准歌词' })
  @Column({ type: 'mediumtext', comment: '标准歌词', nullable: true })
  music_lyric: string;

  @ApiProperty({ description: '翻译歌词' })
  @Column({ type: 'mediumtext', comment: '翻译歌词', nullable: true })
  music_trans: string;

  @ApiProperty({ description: '逐字歌词' })
  @Column({ type: 'mediumtext', comment: '逐字歌词', nullable: true })
  music_yrc: string;

  @ApiProperty({ description: '音译歌词' })
  @Column({ type: 'mediumtext', comment: '音译歌词', nullable: true })
  music_roma: string;

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
  @Index('idx_music_extra_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;
}
