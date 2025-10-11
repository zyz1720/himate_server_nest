import { Controller, Get, Delete, Query, Post, Body } from '@nestjs/common';
import { SessionService } from './session.service';
import { FindAllSessionDto } from './dto/findall-session.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindOneSessionDto } from './dto/findone-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Role } from 'src/common/constants/base-enum.const';
import { IdsDto } from 'src/common/dto/common.dto';
import { EmptyQueryPipe } from 'src/common/pipe/empty-query.pipe';

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
  findAll(@Query() query: FindAllSessionDto, @UserId() uid: number) {
    return this.sessionService.findAllSessionByUid(query, uid);
  }

  @ApiOperation({ summary: '会话详情' })
  @Get('detail')
  findOneBySid(
    @Query(EmptyQueryPipe) query: FindOneSessionDto,
    @UserId() uid: number,
  ) {
    return this.sessionService.findOneSession(query, uid);
  }

  @ApiOperation({ summary: '软删除会话' })
  @Delete('del')
  softDelete(@Query('id') id: number, @UserId() uid: number) {
    return this.sessionService.removeSession(id, uid);
  }

  @ApiOperation({ summary: '恢复会话' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Body() data: IdsDto) {
    return this.sessionService.restoreSession(data);
  }

  @ApiOperation({ summary: '真删除恢复会话' })
  @Roles(Role.Admin)
  @Delete('realDel')
  realRemove(@Body() data: IdsDto) {
    return this.sessionService.realDeletSession(data);
  }
}
