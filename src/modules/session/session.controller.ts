import { Controller, Get, Delete, Query, Post, Body } from '@nestjs/common';
import { SessionService } from './session.service';
import { FindAllSessionDto } from './dto/findall-session.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindOneSessionDto } from './dto/findone-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';

@ApiTags('会话')
@ApiBearerAuth()
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiOperation({ summary: '新建会话' })
  @Post('add')
  create(@Body() data: CreateSessionDto) {
    return this.sessionService.createChatSession(data);
  }

  @ApiOperation({ summary: '用户会话列表' })
  @Get('list')
  findAll(@Query() query: FindAllSessionDto) {
    return this.sessionService.findAllSessionByUid(query);
  }

  @ApiOperation({ summary: '会话详情' })
  @Get('detail')
  findOneBySid(@Query() query: FindOneSessionDto) {
    return this.sessionService.findOneSession(query);
  }

  @ApiOperation({ summary: '删除会话' })
  @Delete('del')
  remove(@Query('id') id: number) {
    return this.sessionService.removeSession(id);
  }
}
