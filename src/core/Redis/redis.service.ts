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
      // ... 其他配置项
    });

    this.client.on('ready', () => {
      // console.log('Redis init success');
    });

    this.client.on('error', (error) => {
      // console.error('Redis init error', error);
    });
  }

  getClient(): Redis {
    if (!this.client) {
      return null;
    }
    return this.client;
  }

  async getValue(key: string) {
    let value = null;
    await this.client.get(key, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        // console.log('resdis', result);
        value = result;
      }
    });
    return value;
  }

  setValue(key: string, value: any, time?: number) {
    this.client.expire(key, time ? time : 0);
    this.client
      .set(key, value)
      .then((result) => console.log('redis set success', result))
      .catch((err) => console.log('redis set error', err));
  }

  delValue(key: string) {
    this.client
      .del(key)
      .then((result) => console.log('redis delete success', result))
      .catch((err) => console.log('redis delete error', err));
  }
}
