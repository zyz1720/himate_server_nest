import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiOkRes,
  ApiOkMsgRes,
  ApiOkPageRes,
} from 'src/common/response/api-response.decorator';
import { GroupMemberService } from './group-member.service';
import {
  AppUpdateGroupMemberDto,
  UpdateGroupMemberAuthDto,
} from './dto/update-group-member.dto';
import { GroupMemberEntity } from './entity/group-member.entity';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { FindAllDto, IdsDto } from 'src/common/dto/common.dto';

@ApiTags('app - 群成员')
@ApiBearerAuth()
@Controller('app/group-member')
export class AppGroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @ApiOperation({ summary: '获取群下所有成员' })
  @ApiOkPageRes(GroupMemberEntity)
  @Get('/:groupId')
  findAll(
    @UserId() uid: number,
    @Param('groupId') groupId: string,
    @Query() query: FindAllDto,
  ) {
    return this.groupMemberService.findAllGroupMemberByGroupId(
      uid,
      parseInt(groupId),
      query,
    );
  }

  @ApiOperation({ summary: '邀请成员' })
  @ApiOkMsgRes()
  @Put('invite/:groupId')
  create(
    @UserId() uid: number,
    @Param('groupId') groupId: string,
    @Body() data: IdsDto,
  ) {
    return this.groupMemberService.addUserGroupMember(
      uid,
      parseInt(groupId),
      data,
    );
  }

  @ApiOperation({ summary: '踢出成员' })
  @ApiOkMsgRes()
  @Delete('remove/:groupId')
  remove(
    @UserId() uid: number,
    @Param('groupId') groupId: string,
    @Body() data: IdsDto,
  ) {
    return this.groupMemberService.removeUserGroupMembers(
      uid,
      parseInt(groupId),
      data,
    );
  }

  @ApiOperation({ summary: '更新信息' })
  @ApiOkRes(GroupMemberEntity)
  @Put('update/:groupId')
  update(
    @UserId() uid: number,
    @Param('groupId') groupId: string,
    @Body() data: AppUpdateGroupMemberDto,
  ) {
    return this.groupMemberService.updateUserGroupMember(
      uid,
      parseInt(groupId),
      data,
    );
  }

  @ApiOperation({ summary: '修改成员权限' })
  @ApiOkRes(GroupMemberEntity)
  @Put('auth/:groupId')
  updateAuth(
    @UserId() uid: number,
    @Param('groupId') groupId: string,
    @Body() data: UpdateGroupMemberAuthDto,
  ) {
    return this.groupMemberService.updateUserGroupMemberAuth(
      uid,
      parseInt(groupId),
      data,
    );
  }

  @ApiOperation({ summary: '用户退出群聊' })
  @ApiOkMsgRes()
  @Delete(':groupId')
  forceRemove(@UserId() uid: number, @Param('groupId') groupId: string) {
    return this.groupMemberService.removeOneselfMember(uid, parseInt(groupId));
  }
}
