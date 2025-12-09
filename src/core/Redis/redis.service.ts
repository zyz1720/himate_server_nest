import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis | null = null;

  constructor(private configService: ConfigService) {}

  /**
   * 初始化 Redis 客户端
   */
  async onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    this.client.on('ready', () => {
      console.log('Redis init success');
    });

    this.client.on('error', (error) => {
      console.error('Redis init error', error?.message);
    });
  }

  /**
   * 获取 Redis 键对应的值
   * @param key Redis 键
   * @returns 键对应的值，或 null 如果键不存在
   */
  async getValue(key: string): Promise<any> {
    if (!this.client) {
      console.error('Redis client is not initialized');
      return null;
    }
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error('Redis get error:', err);
      return null;
    }
  }

  /**
   * 设置 Redis 键对应的值
   * @param key Redis 键
   * @param value 要设置的值
   * @param time 过期时间（秒），可选
   * @returns 是否设置成功
   */
  async setValue(key: string, value: any, time?: number): Promise<boolean> {
    if (!this.client) {
      console.error('Redis client is not initialized');
      return false;
    }
    try {
      await this.client.set(key, value);
      if (time && time > 0) {
        await this.client.expire(key, time);
      }
      console.log('redis set success', key, value, time);
      return true;
    } catch (err) {
      console.error('redis set error:', err);
      return false;
    }
  }

  /**
   * 删除 Redis 键对应的值
   * @param key Redis 键
   * @returns 是否删除成功
   */
  async delValue(key: string): Promise<boolean> {
    if (!this.client) {
      console.error('Redis client is not initialized');
      return false;
    }
    try {
      await this.client.del(key);
      console.log('redis delete success', key);
      return true;
    } catch (err) {
      console.error('redis delete error:', err);
      return false;
    }
  }

  /**
   * 订阅 Redis 通道
   * @param channel Redis 通道
   * @param callback 回调函数，当有消息时触发
   */
  async subscribe(channel: string, callback: () => void) {
    if (!this.client) {
      console.error('Redis client is not initialized');
      return;
    }
    try {
      this.client.subscribe(channel, callback);
    } catch (err) {
      console.error('Redis subscribe error:', err);
    }
  }

  /**
   * 取消订阅 Redis 通道
   * @param channel Redis 通道
   * @param callback 回调函数
   */
  async unsubscribe(channel: string, callback: () => void) {
    if (!this.client) {
      console.error('Redis client is not initialized');
      return;
    }
    try {
      this.client.unsubscribe(channel, callback);
    } catch (err) {
      console.error('Redis unsubscribe error:', err);
    }
  }

  /**
   * 发布 Redis 通道消息
   * @param channel Redis 通道
   * @param message 要发布的消息
   */
  async publish(channel: string, message: string) {
    if (!this.client) {
      console.error('Redis client is not initialized');
      return;
    }
    try {
      this.client.publish(channel, message);
    } catch (err) {
      console.error('Redis publish error:', err);
    }
  }
}
