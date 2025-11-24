import { JwtAuthGuard } from 'src/core/auth/guards/jwt.auth.guard';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { RedisService } from 'src/core/Redis/redis.service';
import { Response } from 'src/common/response/api-response';
import { MessageEntity } from '../message/entity/message.entity';
import { WsUserId } from 'src/core/auth/decorators/ws-user.decorator';
import { SocketService } from './socket.service';
import { I18nService } from 'nestjs-i18n';
import {
  ReadMessageDto,
  SendMessageDto,
} from '../session/dto/operate-message.dto';

@WebSocketGateway(3001, { namespace: 'socket' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly sessionService: SessionService,
    private readonly socketService: SocketService,
    private readonly i18n: I18nService,
  ) {}
  @WebSocketServer()
  server: Server;

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('read-message')
  async handleMessage(
    @WsUserId() uid: number,
    client: Socket,
    @MessageBody() message: ReadMessageDto,
  ): Promise<Response<null>> {
    const readFlag = await this.sessionService.readMessage(uid, message);
    if (readFlag) {
      return Response.ok(this.i18n.t('message.READ_SUCCESS'));
    }
    return Response.fail(this.i18n.t('message.READ_FAILED'));
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('send-message')
  async sendMessage(
    @WsUserId() uid: number,
    client: Socket,
    @MessageBody() message: SendMessageDto,
  ): Promise<Response<null>> {
    Logger.log('[chat]接收消息：', message);
    message.sender_ip = client.handshake.address;
    const toBeSentMessage = await this.sessionService.createAndSendMessage(
      uid,
      message,
    );
    if (toBeSentMessage) {
      this.emitMessage(message.session_id, toBeSentMessage);
      return Response.ok(this.i18n.t('message.SEND_SUCCESS'));
    }
    return Response.fail(this.i18n.t('message.SEND_FAILED'));
  }

  emitMessage(room: string, message: MessageEntity) {
    this.server.to(room).emit('message', message);
  }

  handleConnection(client: Socket) {
    // 监听连接开启事件
    Logger.log(`客户端已连接：${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    // 监听连接关闭事件
    Logger.log(`客户端已断开连接：${client.id}`);
  }
}
