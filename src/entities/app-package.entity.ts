import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('app_package')
export class appPackageEntity {
  @PrimaryGeneratedColumn({ comment: 'app包自增id' })
  id: number;

  @Column({ length: 16, comment: '应用包名称' })
  app_name: string;

  @Column({ length: 8, comment: '应用版本' })
  app_version: string;

  @Column({ length: 200, comment: '应用描述' })
  app_description: string;

  @Column({ type: 'int', comment: '应用大小' })
  app_size: number;

  @Column({ length: 96, comment: '应用文件名' })
  app_fileName: string;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  create_time: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  update_time: Date;
}
