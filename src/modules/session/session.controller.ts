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
import { SessionService } from './session.service';
import { AddSessionDto } from './dto/add-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FindAllSessionDto } from './dto/find-all-session.dto';
import { SessionEntity } from './entity/session.entity';

@ApiTags('admin - 会话管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiOperation({ summary: '添加会话' })
  @ApiOkRes(SessionEntity)
  @Post()
  create(@Body() data: AddSessionDto) {
    return this.sessionService.addSession(data);
  }

  @ApiOperation({ summary: '会话列表' })
  @ApiOkPageRes(SessionEntity)
  @Get()
  findAll(@Query() query: FindAllSessionDto) {
    return this.sessionService.findAllSession(query);
  }

  @ApiOperation({ summary: '获取会话详情' })
  @ApiOkRes(SessionEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionService.findOneSession(parseInt(id));
  }

  @ApiOperation({ summary: '修改会话信息' })
  @ApiOkRes(SessionEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateSessionDto) {
    return this.sessionService.updateSession(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除会话' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.softDeleteSession(parseInt(id));
  }

  @ApiOperation({ summary: '恢复会话' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.sessionService.restoreSession(parseInt(id));
  }

  @ApiOperation({ summary: '真删除会话' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.sessionService.deleteSession(parseInt(id));
  }
}
