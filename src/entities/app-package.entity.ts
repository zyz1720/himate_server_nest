import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DataLength } from 'src/commom/constants/base-enum.const';

@Entity('app_package')
export class appPackageEntity {
  @PrimaryGeneratedColumn({ comment: 'app包自增id' })
  id: number;

  @Column({ length: DataLength.Medium, comment: '应用包名称' })
  app_name: string;

  @Column({ length: DataLength.Short, comment: '应用版本' })
  app_version: string;

  @Column({ length: DataLength.Longer, comment: '应用描述' })
  app_description: string;

  @Column({ type: 'int', comment: '应用大小' })
  app_size: number;

  @Column({ length: DataLength.Long, comment: '应用文件名' })
  app_fileName: string;

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
