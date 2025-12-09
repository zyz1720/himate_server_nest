import { Injectable } from '@nestjs/common';
import { Observable, Subject, finalize } from 'rxjs';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SseService {
  constructor(private redisService: RedisService) {}
  private userConnections = new Map<string, Subject<any>>();

  // 创建用户连接
  createUserConnection(userId: string): Observable<any> {
    const subject = new Subject<any>();
    this.userConnections.set(userId, subject);

    // 设置断开连接时的清理
    const cleanup = () => {
      this.userConnections.delete(userId);
    };

    return subject.asObservable().pipe(finalize(cleanup));
  }

  // 向指定用户发送消息
  sendToUser(userId: string, data: any): boolean {
    const subject = this.userConnections.get(userId);
    if (subject) {
      subject.next({ data });
      return true;
    }
    return false;
  }

  // 检查用户是否在线
  isUserOnline(userId: string): boolean {
    return this.userConnections.has(userId);
  }
}
