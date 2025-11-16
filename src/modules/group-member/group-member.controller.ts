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
import { GroupMemberService } from './group-member.service';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { FindAllGroupMemberDto } from './dto/find-all-group-member.dto';
import { GroupMemberEntity } from './entity/group-member.entity';

@ApiTags('admin - 群成员管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('group-member')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @ApiOperation({ summary: '添加群成员' })
  @ApiOkRes(GroupMemberEntity)
  @Post()
  create(@Body() data: AddGroupMemberDto) {
    return this.groupMemberService.addGroupMember(data);
  }

  @ApiOperation({ summary: '群成员列表' })
  @ApiOkPageRes(GroupMemberEntity)
  @Get()
  findAll(@Query() query: FindAllGroupMemberDto) {
    return this.groupMemberService.findAllGroupMember(query);
  }

  @ApiOperation({ summary: '获取群成员详情' })
  @ApiOkRes(GroupMemberEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupMemberService.findOneGroupMember(parseInt(id));
  }

  @ApiOperation({ summary: '修改群成员信息' })
  @ApiOkRes(GroupMemberEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateGroupMemberDto) {
    return this.groupMemberService.updateGroupMember(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除群成员' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupMemberService.softDeleteGroupMember(parseInt(id));
  }

  @ApiOperation({ summary: '恢复群成员' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.groupMemberService.restoreGroupMember(parseInt(id));
  }

  @ApiOperation({ summary: '真删除群成员' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.groupMemberService.deleteGroupMember(parseInt(id));
  }
}
