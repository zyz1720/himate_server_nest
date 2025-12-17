import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Whether, DataLength } from 'src/common/constants/database-enum.const';
import { MusicEntity } from 'src/modules/music/entity/music.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';

@Entity('favorites')
@Unique('idx_favorites_id_uid', ['id', 'favorites_uid'])
export class FavoritesEntity {
  @ApiProperty({ description: '文件自增id' })
  @PrimaryGeneratedColumn({ comment: '文件自增id' })
  id: number;

  @ApiProperty({ description: '收藏夹用户id' })
  @Column({ type: 'int', comment: '收藏夹用户id' })
  favorites_uid: number;

  @ApiProperty({ description: '收藏夹描述' })
  @Column({ type: 'text', comment: '收藏夹描述', nullable: true })
  favorites_remarks: string;

  @ApiProperty({ description: '收藏夹名' })
  @Column({ comment: '收藏夹名', length: DataLength.Long })
  favorites_name: string;

  @ApiProperty({ description: '收藏夹封面' })
  @Column({
    comment: '收藏夹封面',
    length: DataLength.Long,
    nullable: true,
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

  @ManyToMany(() => MusicEntity, (music) => music.favorites)
  @JoinTable({ name: 'favorites_music' })
  music: MusicEntity[];

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'favorites_uid' })
  @Index('idx_favorites_uid')
  user: UserEntity;
}
