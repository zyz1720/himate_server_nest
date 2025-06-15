import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  MessageType as FileType,
  FileUseType,
  DataLength,
} from 'src/commom/constants/base-enum.const';

@Entity('file')
export class fileEntity {
  @PrimaryGeneratedColumn({ comment: '文件自增id' })
  id: number;

  @Index({ unique: true })
  @Column({ length: DataLength.Long, comment: '文件名' })
  file_name: string;

  @Column({ type: 'bigint', comment: '文件大小' })
  file_size: number;

  @Column({ type: 'enum', enum: FileType, comment: '文件类型' })
  file_type: string;

  @Column({
    type: 'enum',
    enum: FileUseType,
    comment: '使用类型',
    default: FileUseType.Unknown,
  })
  use_type: string;

  @Index()
  @Column({ length: DataLength.HASH, comment: '文件hash' })
  file_hash: string;

  @Column({ type: 'int', comment: '上传者id' })
  upload_uid: number;

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
