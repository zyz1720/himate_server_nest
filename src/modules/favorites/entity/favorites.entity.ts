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
import { Whether } from 'src/common/constants/database-enum.const';

@Entity('favorites')
export class FavoritesEntity {
  @ApiProperty({ description: '文件自增id' })
  @PrimaryGeneratedColumn({ comment: '文件自增id' })
  id: number;

  @ApiProperty({ description: '收藏夹描述' })
  @Column({ type: 'text', comment: '收藏夹描述', nullable: true })
  favorites_remarks: string;

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
  @Index('idx_favorites_delete_time')
  @DeleteDateColumn({ type: 'timestamp', comment: '删除时间' })
  delete_time: Date;

  @ApiProperty({ description: '收藏夹名' })
  @Column({ comment: '收藏夹名', length: 120 })
  favorites_name: string;

  @ApiProperty({ description: '收藏夹封面' })
  @Column({
    comment: '收藏夹封面',
    length: 120,
    default: 'default_assets/default_favorites_cover.jpg',
  })
  favorites_cover: string;

  @ApiProperty({ description: '是否公开' })
  @Column({
    type: 'enum',
    enum: Whether,
    comment: '是否公开',
    default: Whether.N,
  })
  is_public: Whether;

  @ApiProperty({ description: '是否是默认收藏夹' })
  @Column({
    type: 'enum',
    enum: Whether,
    comment: '是否是默认收藏夹',
    default: Whether.N,
  })
  is_default: Whether;
}
