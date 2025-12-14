import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketService } from 'src/core/socket/socket.service';
import { GroupMessageEvent } from 'src/modules/group/events/group-message.event';

@Injectable()
export class GroupMessageListener {
  constructor(private readonly socketService: SocketService) {}

  @OnEvent('group.message')
  async processGroupMessageEvent(payload: GroupMessageEvent) {
    const { uid, group_id, message } = payload || {};
    this.socketService.sendSystemMessage(uid, group_id, message);
  }
}
