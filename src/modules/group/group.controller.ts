import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FindAllGroupDto } from './dto/findall-group.dto';
import { FindOneGroupDto } from './dto/findone-group.dto';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Role } from 'src/common/constants/base-enum.const';
import { GroupIdsDto } from './dto/group-id.dto';
import { EmptyQueryPipe } from 'src/common/pipe/empty-query.pipe';

@ApiTags('群组')
@ApiBearerAuth()
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '创建群组' })
  @Post('add')
  create(@Body() data: CreateGroupDto) {
    return this.groupService.createGroup(data);
  }

  @ApiOperation({ summary: '群组列表' })
  @Get('list')
  findAll(@Query() query: FindAllGroupDto) {
    return this.groupService.findAllGroup(query);
  }

  @ApiOperation({ summary: '获取群组详情' })
  @Get('detail')
  findOne(@Query(EmptyQueryPipe) query: FindOneGroupDto) {
    return this.groupService.findOneGroup(query);
  }

  @ApiOperation({ summary: '修改群组' })
  @Put('edit')
  update(@Body() data: UpdateGroupDto, @UserId() uid: number) {
    return this.groupService.updateGroup(data, uid);
  }

  @ApiOperation({ summary: '软删除群组' })
  @Delete('del')
  remove(@Body() data: GroupIdsDto, @UserId() uid: number) {
    return this.groupService.softDeleteGroup(data, uid);
  }

  @ApiOperation({ summary: '恢复群组' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Body() data: GroupIdsDto) {
    return this.groupService.restoreGroup(data);
  }

  @ApiOperation({ summary: '真删除群组' })
  @Roles(Role.Admin)
  @Delete('realDel')
  realRemove(@Body() data: GroupIdsDto) {
    return this.groupService.deleteGroup(data);
  }
}
