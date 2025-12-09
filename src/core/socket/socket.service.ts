import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { SessionService } from 'src/modules/session/session.service';
import {
  ReadMessageDto,
  SendMessageDto,
} from 'src/modules/session/dto/operate-message.dto';
import { MessageEntity } from 'src/modules/message/entity/message.entity';
import { SenderInfoDto } from 'src/common/dto/common.dto';
import { Response } from 'src/common/response/api-response';

interface MessageWithSenderInfo {
  message: MessageEntity;
  senderInfo: SenderInfoDto;
}

@Injectable()
export class SocketService {
  constructor(
    private readonly i18n: I18nService,
    private readonly sessionService: SessionService,
  ) {}

  // 读取消息
  async readMessage(uid: number, message: ReadMessageDto) {
    const readFlag = await this.sessionService.readMessage(uid, message);
    if (readFlag) {
      return Response.ok(this.i18n.t('message.READ_SUCCESS'), readFlag);
    }
    return Response.fail(this.i18n.t('message.READ_FAILED'));
  }

  // 发送消息
  async sendMessage(uid: number, message: SendMessageDto) {
    const sentMessage = await this.sessionService.createAndSendMessage(
      uid,
      message,
    );
    if (sentMessage) {
      return Response.ok<MessageWithSenderInfo>(
        this.i18n.t('message.SEND_SUCCESS'),
        sentMessage,
      );
    }
    return Response.fail(this.i18n.t('message.SEND_FAILED'));
  }
}
