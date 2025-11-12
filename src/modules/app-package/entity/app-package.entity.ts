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

@Entity('app_package')
export class AppPackageEntity {
  @ApiProperty({ description: 'app包自增id' })
  @PrimaryGeneratedColumn({ comment: 'app包自增id' })
  id: number;

  @ApiProperty({ description: '应用大小' })
  @Column({ type: 'int', comment: '应用大小' })
  app_size: number;

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
  @Index()
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @ApiProperty({ description: '应用包名称' })
  @Column({ comment: '应用包名称', length: 48 })
  app_name: string;

  @ApiProperty({ description: '应用版本' })
  @Column({ comment: '应用版本', length: 16 })
  app_version: string;

  @ApiProperty({ description: '应用描述' })
  @Column({ comment: '应用描述', length: 240 })
  app_description: string;

  @ApiProperty({ description: '文件路径' })
  @Column({ comment: '文件路径', length: 120 })
  app_file_key: string;
}
