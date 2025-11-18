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
import { MessageReadRecordsService } from './message-read-records.service';
import { AddMessageReadRecordsDto } from './dto/add-message-read-records.dto';
import { UpdateMessageReadRecordsDto } from './dto/update-message-read-records.dto';
import { FindAllMessageReadRecordsDto } from './dto/find-all-message-read-records.dto';
import { MessageReadRecordsEntity } from './entity/message-read-records.entity';

@ApiTags('admin - 消息读取记录管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('message-read-records')
export class MessageReadRecordsController {
  constructor(
    private readonly messageReadRecordsService: MessageReadRecordsService,
  ) {}

  @ApiOperation({ summary: '添加消息读取记录' })
  @ApiOkRes(MessageReadRecordsEntity)
  @Post()
  create(@Body() data: AddMessageReadRecordsDto) {
    return this.messageReadRecordsService.addMessageReadRecords(data);
  }

  @ApiOperation({ summary: '消息读取记录列表' })
  @ApiOkPageRes(MessageReadRecordsEntity)
  @Get()
  findAll(@Query() query: FindAllMessageReadRecordsDto) {
    return this.messageReadRecordsService.findAllMessageReadRecords(query);
  }

  @ApiOperation({ summary: '获取消息读取记录详情' })
  @ApiOkRes(MessageReadRecordsEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageReadRecordsService.findOneMessageReadRecords(
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '修改消息读取记录信息' })
  @ApiOkRes(MessageReadRecordsEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateMessageReadRecordsDto) {
    return this.messageReadRecordsService.updateMessageReadRecords(
      parseInt(id),
      data,
    );
  }

  @ApiOperation({ summary: '软删除消息读取记录' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageReadRecordsService.softDeleteMessageReadRecords(
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '恢复消息读取记录' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.messageReadRecordsService.restoreMessageReadRecords(
      parseInt(id),
    );
  }

  @ApiOperation({ summary: '真删除消息读取记录' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.messageReadRecordsService.deleteMessageReadRecords(
      parseInt(id),
    );
  }
}
