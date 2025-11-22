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
import { DataLength } from 'src/common/constants/database-enum.const';

// 枚举定义
export enum FileTypeEnum {
  image = 'image',
  video = 'video',
  audio = 'audio',
  document = 'document',
  other = 'other',
}
export enum UseTypeEnum {
  user = 'user',
  chat = 'chat',
  group = 'group',
  system = 'system',
  music = 'music',
  upload = 'upload',
  unknown = 'unknown',
}

@Entity('file')
export class FileEntity {
  @ApiProperty({ description: '文件自增id' })
  @PrimaryGeneratedColumn({ comment: '文件自增id' })
  id: number;

  @ApiProperty({ description: '原始文件名' })
  @Column({ comment: '原始文件名', length: DataLength.Longer })
  original_file_name: string;

  @ApiProperty({ description: '文件类型' })
  @Column({
    type: 'enum',
    comment: '文件类型',
    enum: FileTypeEnum,
    default: 'other',
  })
  file_type: FileTypeEnum;

  @ApiProperty({ description: '使用类型' })
  @Column({
    type: 'enum',
    comment: '使用类型',
    enum: UseTypeEnum,
    default: 'unknown',
  })
  use_type: UseTypeEnum;

  @ApiProperty({ description: '文件hash' })
  @Column({ comment: '文件hash', length: DataLength.HASH })
  file_hash: string;

  @ApiProperty({ description: '文件key' })
  @Index('idx_file_file_key_unique', { unique: true })
  @Column({ comment: '文件key', length: DataLength.Long })
  file_key: string;

  @ApiProperty({ description: '文件大小' })
  @Column({ type: 'bigint', comment: '文件大小' })
  file_size: number;

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
  @Column({ type: 'int', comment: '修改者id', nullable: true })
  update_by: number;

  @ApiProperty({ description: '删除时间' })
  @Index('idx_file_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;
}
