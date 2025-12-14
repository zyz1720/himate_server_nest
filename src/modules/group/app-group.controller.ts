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
import { GroupService } from './group.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AppAppFindAllGroupDto } from './dto/find-all-group.dto';
import { GroupEntity } from './entity/group.entity';
import { IdsDto } from 'src/common/dto/common.dto';
import { UserId } from 'src/core/auth/decorators/user.decorator';

@ApiTags('app - 群组')
@ApiBearerAuth()
@Controller('app/group')
export class AppGroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '创建群组' })
  @ApiOkRes(GroupEntity)
  @Post()
  create(@UserId() uid: number, @Body() data: IdsDto) {
    return this.groupService.addUserGroup(uid, data);
  }

  @ApiOperation({ summary: '群组列表' })
  @ApiOkPageRes(GroupEntity)
  @Get()
  findAll(@UserId() uid: number, @Query() query: AppAppFindAllGroupDto) {
    return this.groupService.findAllUserGroup(uid, query);
  }

  @ApiOperation({ summary: '群组详情' })
  @ApiOkRes(GroupEntity)
  @Get(':id/detail')
  findOne(@UserId() uid: number, @Param('id') id: string) {
    return this.groupService.findOneUserGroup(uid, parseInt(id));
  }

  @ApiOperation({ summary: '修改群组信息' })
  @ApiOkRes(GroupEntity)
  @Put(':id')
  update(
    @UserId() uid: number,
    @Param('id') id: string,
    @Body() data: UpdateGroupDto,
  ) {
    return this.groupService.updateUserGroup(uid, parseInt(id), data);
  }

  @ApiOperation({ summary: '解散群组' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@UserId() uid: number, @Param('id') id: string) {
    return this.groupService.deleteUserGroup(uid, parseInt(id));
  }
}
