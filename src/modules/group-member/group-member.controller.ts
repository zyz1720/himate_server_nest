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
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Role } from 'src/commom/constants/base-enum.const';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { EmptyQueryPipe } from 'src/commom/pipe/empty-query.pipe';

@ApiTags('群成员')
@ApiBearerAuth()
@Controller('groupMember')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @ApiOperation({ summary: '创建群成员' })
  @Post('add')
  create(@Body() data: CreateGroupMemberDto, @UserId() uid: number) {
    return this.groupMemberService.createGroupMember(data, uid);
  }

  @ApiOperation({ summary: '获取群成员详情' })
  @Get('detail')
  findOne(
    @Query(EmptyQueryPipe) query: FindOneGroupMemberDto,
    @UserId() uid: number,
  ) {
    return this.groupMemberService.findOneGroupMember(query, uid);
  }

  @ApiOperation({ summary: '某个用户加入的所有群' })
  @Get('joinGroup')
  findAll(@Query() query: FindJoinGroupDto, @UserId() uid: number) {
    return this.groupMemberService.findAllJoinGroupDetail(query, uid);
  }

  @ApiOperation({ summary: '修改群成员信息' })
  @Put('edit')
  update(@Body() data: UpdateGroupMemberDto, @UserId() uid: number) {
    return this.groupMemberService.updateGroupMember(data, uid);
  }

  @ApiOperation({ summary: '删除群成员' })
  @Delete('del')
  remove(@Query('id') id: number, @UserId() uid: number) {
    return this.groupMemberService.removeGroupMember(id, uid);
  }

  @ApiOperation({ summary: '删除某个群下的所有群成员' })
  @Delete('delMore')
  removeMore(@Query('group_id') group_id: string, @UserId() uid: number) {
    return this.groupMemberService.removeMoreGroupMember(group_id, uid);
  }

  @ApiOperation({ summary: '恢复某个群下的所有群成员' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Query('group_id') group_id: string) {
    return this.groupMemberService.restoreMoreGroupMember(group_id);
  }
}
