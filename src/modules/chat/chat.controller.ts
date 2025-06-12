import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllChatDto } from './dto/findall-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { IdsDto } from 'src/commom/dto/commom.dto';
import { Roles } from 'src/core/auth/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';

@ApiTags('聊天消息')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '创建聊天消息' })
  @Post('add')
  create(@Body() data: CreateChatDto) {
    return this.chatService.createChatmsg(data);
  }

  @ApiOperation({ summary: '聊天消息列表' })
  @Get('list')
  findAll(@Query() query: FindAllChatDto) {
    return this.chatService.findAllChatmsg(query);
  }

  @ApiOperation({ summary: '获取消息详情' })
  @Get('detail')
  findOne(@Query('id', ParseIntPipe) id: number) {
    return this.chatService.findOneChatmsgbyId(id);
  }

  @ApiOperation({ summary: '修改消息' })
  @Roles(Role.Admin)
  @Put('edit')
  update(@Body() data: UpdateChatDto) {
    return this.chatService.updateChatmsg(data);
  }

  @ApiOperation({ summary: '删除某个会话的所有消息' })
  @Delete('delMore')
  removeMore(@Query('session_id') session_id: string) {
    return this.chatService.removeMoreChatmsg(session_id);
  }

  @ApiOperation({ summary: '软删除消息' })
  @Delete('del')
  remove(@Body() data: IdsDto) {
    return this.chatService.softDeleteChatmsg(data);
  }

  @ApiOperation({ summary: '恢复消息' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Body() data: IdsDto) {
    return this.chatService.restoreChatmsg(data);
  }

  @ApiOperation({ summary: '真删除消息' })
  @Roles(Role.Admin)
  @Delete('realDel')
  realRemove(@Body() data: IdsDto) {
    return this.chatService.deleteChatmsg(data);
  }
}
