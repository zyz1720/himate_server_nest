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

@Entity('music')
export class MusicEntity {
  @ApiProperty({ description: '音乐自增id' })
  @PrimaryGeneratedColumn({ comment: '音乐自增id' })
  id: number;

  @ApiProperty({ description: '采样率' })
  @Column({ type: 'int', comment: '采样率', nullable: true })
  sample_rate: number;

  @ApiProperty({ description: '比特率' })
  @Column({ type: 'int', comment: '比特率', nullable: true })
  bitrate: number;

  @ApiProperty({ description: '音乐时长' })
  @Column({ type: 'int', comment: '音乐时长', nullable: true })
  duration: number;

  @ApiProperty({ description: '音乐艺术家集合' })
  @Column({ type: 'json', comment: '音乐艺术家集合', nullable: true })
  artists: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;

  @ApiProperty({ description: '音乐额外信息id' })
  @Column({ type: 'int', comment: '音乐额外信息id', nullable: true })
  music_extra_id: number;

  @ApiProperty({ description: '创建者id' })
  @Column({ type: 'int', comment: '创建者id' })
  create_by: number;

  @ApiProperty({ description: '修改者id' })
  @Column({ type: 'int', comment: '修改者id' })
  update_by: number;

  @ApiProperty({ description: '删除时间' })
  @Index('idx_music_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @ApiProperty({ description: '文件id' })
  @Column({ type: 'int', comment: '文件id' })
  file_id: number;

  @ApiProperty({ description: '音乐名称' })
  @Column({ comment: '音乐名称', length: 120 })
  title: string;

  @ApiProperty({ description: '音乐艺术家' })
  @Column({ comment: '音乐艺术家', length: 120, nullable: true })
  artist: string;

  @ApiProperty({ description: '专辑名' })
  @Column({ comment: '专辑名', length: 120, nullable: true })
  album: string;
}
