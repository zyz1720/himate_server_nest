import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindJoinGroupDto } from './dto/findjoin-group.dto';
import { FindOneGroupMemberDto } from './dto/findOne-group-member.dto';
import { Roles } from 'src/core/auth/auth.decorator';
import { Role } from 'src/commom/constants/base-enum.const';

@ApiTags('群成员')
@ApiBearerAuth()
@Controller('groupMember')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @ApiOperation({ summary: '创建群成员' })
  @Post('add')
  create(@Body() data: CreateGroupMemberDto) {
    return this.groupMemberService.createGroupMember(data);
  }

  @ApiOperation({ summary: '获取群成员详情' })
  @Get('detail')
  findOne(@Query() query: FindOneGroupMemberDto) {
    return this.groupMemberService.findOneGroupMember(query);
  }

  @ApiOperation({ summary: '某个用户加入的所有群' })
  @Get('joinGroup')
  findAll(@Query() query: FindJoinGroupDto) {
    return this.groupMemberService.findAllJoinGroupDetail(query);
  }

  @ApiOperation({ summary: '修改群成员信息' })
  @Put('edit')
  update(@Body() data: UpdateGroupMemberDto) {
    return this.groupMemberService.updateGroupMember(data);
  }

  @ApiOperation({ summary: '删除群成员' })
  @Delete('del')
  remove(@Query('id') id: number) {
    return this.groupMemberService.removeGroupMember(id);
  }

  @ApiOperation({ summary: '删除某个群下的所有群成员' })
  @Roles(Role.Admin)
  @Delete('delMore')
  removeMore(@Query('group_Id') group_Id: string) {
    return this.groupMemberService.removeMoreGroupMember(group_Id);
  }
}
