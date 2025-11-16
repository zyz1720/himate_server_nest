import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiOkRes,
  ApiOkMsgRes,
} from 'src/common/response/api-response.decorator';
import { GroupMemberService } from './group-member.service';
import {
  AppUpdateGroupMemberDto,
  UpdateGroupMemberAuthDto,
} from './dto/update-group-member.dto';
import { GroupMemberEntity } from './entity/group-member.entity';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { OperateGroupMemberDto } from './dto/operate-group-member.dto';

@ApiTags('app - 群成员')
@ApiBearerAuth()
@Controller('app/group-member')
export class AppGroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @ApiOperation({ summary: '邀请群成员' })
  @ApiOkMsgRes()
  @Post('invite')
  create(@UserId() uid: number, @Body() data: OperateGroupMemberDto) {
    return this.groupMemberService.addUserGroupMember(uid, data);
  }

  @ApiOperation({ summary: '踢出群成员' })
  @ApiOkMsgRes()
  @Post('remove')
  remove(@UserId() uid: number, @Body() data: OperateGroupMemberDto) {
    return this.groupMemberService.removeUserGroupMembers(uid, data);
  }

  @ApiOperation({ summary: '用户更新成员信息' })
  @ApiOkRes(GroupMemberEntity)
  @Post('update')
  update(@UserId() uid: number, @Body() data: AppUpdateGroupMemberDto) {
    return this.groupMemberService.updateUserGroupMember(uid, data);
  }

  @ApiOperation({ summary: '修改群成员权限' })
  @ApiOkRes(GroupMemberEntity)
  @Post('auth')
  updateAuth(@UserId() uid: number, @Body() data: UpdateGroupMemberAuthDto) {
    return this.groupMemberService.updateUserGroupMemberAuth(uid, data);
  }

  @ApiOperation({ summary: '用户退出群聊' })
  @ApiOkMsgRes()
  @Delete(':groupId')
  forceRemove(@UserId() uid: number, @Param('groupId') groupId: string) {
    return this.groupMemberService.removeOneselfMember(uid, parseInt(groupId));
  }
}
