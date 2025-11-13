import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiOkRes,
  ApiOkMsgRes,
  ApiOkPageRes,
} from 'src/common/response/api-response.decorator';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Role } from 'src/common/constants/database-enum.const';
import { MessageService } from './message.service';
import { AddMessageDto } from './dto/add-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FindAllMessageDto } from './dto/find-all-message.dto';
import { MessageEntity } from './entity/message.entity';

@ApiTags('消息管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: '添加消息' })
  @ApiOkRes(MessageEntity)
  @Post()
  create(@Body() data: AddMessageDto) {
    return this.messageService.addMessage(data);
  }

  @ApiOperation({ summary: '消息列表' })
  @ApiOkPageRes(MessageEntity)
  @Get()
  findAll(@Query() query: FindAllMessageDto) {
    return this.messageService.findAllMessage(query);
  }

  @ApiOperation({ summary: '获取消息详情' })
  @ApiOkRes(MessageEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOneMessage(parseInt(id));
  }

  @ApiOperation({ summary: '修改消息信息' })
  @ApiOkRes(MessageEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateMessageDto) {
    return this.messageService.updateMessage(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除消息' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.softDeleteMessage(parseInt(id));
  }

  @ApiOperation({ summary: '恢复消息' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.messageService.restoreMessage(parseInt(id));
  }

  @ApiOperation({ summary: '真删除消息' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.messageService.deleteMessage(parseInt(id));
  }
}
