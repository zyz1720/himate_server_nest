import { Body, Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiOkMsgRes,
  ApiOkPageRes,
} from 'src/common/response/api-response.decorator';
import { MessageService } from './message.service';
import { MessageEntity } from './entity/message.entity';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { FindAllDto, IdsDto } from 'src/common/dto/common.dto';

@ApiTags('app - 消息')
@ApiBearerAuth()
@Controller('app/message')
export class AppMessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: '用户发送的消息列表' })
  @ApiOkPageRes(MessageEntity)
  @Get()
  findAll(@UserId() uid: number, @Query() query: FindAllDto) {
    return this.messageService.findAllUserMessage(uid, query);
  }

  @ApiOperation({ summary: '批量删除用户消息' })
  @ApiOkMsgRes()
  @Delete('batch')
  remove(@UserId() uid: number, @Body() data: IdsDto) {
    return this.messageService.softDeleteUserMessages(uid, data);
  }
}
