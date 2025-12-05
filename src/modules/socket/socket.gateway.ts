import { WsJwtAuthGuard } from 'src/core/auth/guards/ws-jwt.auth.guard';
import {
  ConnectedSocket,
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

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('read-message')
  async handleMessage(
    @WsUserId() uid: number,
    @MessageBody() message: ReadMessageDto,
  ): Promise<Response<boolean>> {
    const readFlag = await this.sessionService.readMessage(uid, message);
    if (readFlag) {
      return Response.ok(this.i18n.t('message.READ_SUCCESS'), readFlag);
    }
    return Response.fail(this.i18n.t('message.READ_FAILED'));
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('send-message')
  async sendMessage(
    @WsUserId() uid: number,
    @ConnectedSocket() client: Socket,
    @MessageBody() message: SendMessageDto,
  ): Promise<Response<MessageEntity>> {
    Logger.log('[send-message]接收消息：', message);
    message.sender_ip = client.handshake.address;
    const toBeSentMessage = await this.sessionService.createAndSendMessage(
      uid,
      message,
    );
    if (toBeSentMessage) {
      this.emitMessage(message.session_id, toBeSentMessage);
      return Response.ok(this.i18n.t('message.SEND_SUCCESS'), toBeSentMessage);
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
