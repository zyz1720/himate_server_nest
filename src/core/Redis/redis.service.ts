import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis | null = null;

  constructor(private configService: ConfigService) {}

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
}
