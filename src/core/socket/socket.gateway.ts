import { WsJwtAuthGuard } from 'src/core/auth/guards/ws-jwt.auth.guard';
import { WsThrottlerGuard } from 'src/core/auth/guards/ws-throttler.guard';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsUserId } from 'src/core/auth/decorators/ws-user.decorator';
import {
  ReadMessageDto,
  SendMessageDto,
} from 'src/modules/session/dto/operate-message.dto';
import { SocketService } from './socket.service';
import { Response } from 'src/common/response/api-response';
import { I18nService } from 'nestjs-i18n';
import { Throttle } from '@nestjs/throttler';

@WebSocketGateway(4001, { namespace: 'socket' })
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly socketService: SocketService,
    private readonly i18n: I18nService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.socketService.setServer(server);
  }

  @UseGuards(WsJwtAuthGuard, WsThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 6000 } })
  @SubscribeMessage('read-message')
  async handleMessage(
    @WsUserId() uid: number,
    @MessageBody() message: ReadMessageDto,
  ) {
    return this.socketService.readMessage(uid, message);
  }

  @UseGuards(WsJwtAuthGuard, WsThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 100 } })
  @SubscribeMessage('send-message')
  async sendMessage(
    @WsUserId() uid: number,
    @ConnectedSocket() client: Socket,
    @MessageBody() message: SendMessageDto,
  ) {
    message.sender_ip = client.handshake.address;
    const result = await this.socketService.sendMessage(uid, message);
    if (result.code === 0) {
      client.to(message.session_id).emit('message', [result.data]);
    }
    return result;
  }

  @UseGuards(WsJwtAuthGuard, WsThrottlerGuard)
  @SubscribeMessage('join-room')
  async joinRoom(
    @WsUserId() uid: number,
    @ConnectedSocket() client: Socket,
    @MessageBody() session_id: string,
  ) {
    await client.join(session_id);
    await this.socketService.processAllSessionMessagesUnread(uid, session_id);
    return Response.ok(this.i18n.t('message.JOIN_SUCCESS'), session_id);
  }

  @UseGuards(WsJwtAuthGuard, WsThrottlerGuard)
  @SubscribeMessage('leave-room')
  async leaveRoom(
    @WsUserId() uid: number,
    @ConnectedSocket() client: Socket,
    @MessageBody() session_id: string,
  ) {
    await client.leave(session_id);
    return Response.ok(this.i18n.t('message.LEAVE_SUCCESS'), session_id);
  }

  handleConnection(client: Socket) {
    // 监听连接开启事件
    Logger.log(`客户端已连接：${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // 监听连接关闭事件
    Logger.log(`客户端已断开连接：${client.id}`);
  }
}
