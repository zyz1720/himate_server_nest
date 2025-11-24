import { Injectable } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SocketService {
  constructor(
    private readonly sessionService: SessionService,

    private readonly i18n: I18nService,
  ) {}
}
