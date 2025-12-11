import { Injectable } from '@nestjs/common';
import { Observable, Subject, finalize, map } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { SessionService } from 'src/modules/session/session.service';
import { SessionWithExtra } from 'src/modules/session/types/session-response.type';

@Injectable()
export class SseService {
  constructor(private sessionService: SessionService) {}
  private userConnections = new Map<string, Subject<MessageEvent>>();

  // 创建用户连接
  createUserConnection(userId: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    this.userConnections.set(userId, subject);
    this.processSessionWithExtra(userId);
    // 设置断开连接时的清理
    const cleanup = () => {
      this.userConnections.delete(userId);
    };

    return subject.asObservable().pipe(finalize(cleanup));
  }

  // 向指定用户发送消息
  sendToUser(userId: string, data: SessionWithExtra[]): boolean {
    const subject = this.userConnections.get(userId);
    if (subject) {
      try {
        subject.next({ data });
        return true;
      } catch (error) {
        console.error('Error sending SSE message to user:', userId, error);
        return false;
      }
    }
    return false;
  }

  // 向房间内的所有用户推送
  sendToUsers(userIds: number[], data: SessionWithExtra[]): boolean {
    let successCount = 0;
    for (const userId of userIds) {
      if (this.sendToUser(String(userId), data)) {
        successCount++;
      }
    }
    return successCount > 0;
  }

  // 检查用户是否在线
  isUserOnline(userId: string): boolean {
    return this.userConnections.has(userId);
  }

  // 获取用户会话信息并发送给客户端
  async processSessionWithExtra(uid: string) {
    let currentPage = 1;
    const pageSize = 20;
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const sessions = await this.sessionService.findAllUserSession(
          Number(uid),
          {
            current: currentPage,
            pageSize: pageSize,
          },
        );
        if (sessions?.list?.length) {
          this.sendToUser(uid, sessions.list);
        }
        hasMoreData =
          sessions?.list?.length === pageSize &&
          sessions?.total > currentPage * pageSize;
        currentPage++;
      } catch (error) {
        console.error('Error processing session data for user:', uid, error);
        hasMoreData = false;
      }
    }
  }
}
