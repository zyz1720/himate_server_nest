import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, EntityManager, Repository } from 'typeorm';

export interface TransactionManager {
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  getRepository<T>(entityCls: new () => T): Repository<T>;
}

@Injectable()
export class QueryRunnerFactory implements TransactionManager {
  private queryRunner?: QueryRunner; // 允许为 undefined
  private isTransactionActive: boolean = false; // 添加事务状态标识

  constructor(private readonly dataSource: DataSource) {}

  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    try {
      await this.queryRunner.connect();
      await this.queryRunner.startTransaction();
      this.isTransactionActive = true; // 事务已启动
    } catch (error) {
      await this.queryRunner?.release(); // 确保在出错时释放
      throw error; // 抛出错误
    }
  }

  async commitTransaction(): Promise<void> {
    if (!this.isTransactionActive) {
      throw new Error('No active transaction to commit.');
    }
    try {
      await this.queryRunner!.commitTransaction();
    } catch (error) {
      await this.rollbackTransaction(); // 如果提交失败，回滚事务
      throw error; // 抛出错误
    } finally {
      await this.queryRunner!.release();
      this.isTransactionActive = false; // 重置状态
    }
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.isTransactionActive) {
      throw new Error('No active transaction to rollback.');
    }
    await this.queryRunner!.rollbackTransaction();
    await this.queryRunner!.release();
  }

  getRepository<T>(entityCls: new () => T): Repository<T> {
    if (!this.isTransactionActive) {
      throw new Error('No active transaction to get repository.');
    }
    const entityManager: EntityManager = this.queryRunner!.manager;
    return entityManager.getRepository(entityCls);
  }
}
