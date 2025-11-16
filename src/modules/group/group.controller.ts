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
import { GroupService } from './group.service';
import { AddGroupDto } from './dto/add-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FindAllGroupDto } from './dto/find-all-group.dto';
import { GroupEntity } from './entity/group.entity';

@ApiTags('admin - 群组管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '添加群组' })
  @ApiOkRes(GroupEntity)
  @Post()
  create(@Body() data: AddGroupDto) {
    return this.groupService.addGroup(data);
  }

  @ApiOperation({ summary: '群组列表' })
  @ApiOkPageRes(GroupEntity)
  @Get()
  findAll(@Query() query: FindAllGroupDto) {
    return this.groupService.findAllGroup(query);
  }

  @ApiOperation({ summary: '获取群组详情' })
  @ApiOkRes(GroupEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOneGroup(parseInt(id));
  }

  @ApiOperation({ summary: '修改群组信息' })
  @ApiOkRes(GroupEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateGroupDto) {
    return this.groupService.updateGroup(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除群组' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.softDeleteGroup(parseInt(id));
  }

  @ApiOperation({ summary: '恢复群组' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.groupService.restoreGroup(parseInt(id));
  }

  @ApiOperation({ summary: '真删除群组' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.groupService.deleteGroup(parseInt(id));
  }
}
