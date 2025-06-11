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

  @ApiOperation({ summary: '获取群组详情id' })
  @Get('detail')
  findOne(@Query('id') id: number) {
    return this.groupService.findOneGroup(id);
  }

  @ApiOperation({ summary: '获取群组详情(通过group_id)' })
  @Get('detailBygId')
  findOneByGid(@Query('group_id') group_id: string) {
    return this.groupService.findOneGroupBygroupId(group_id);
  }

  @ApiOperation({ summary: '修改群组' })
  @Put('edit')
  update(@Body() data: UpdateGroupDto) {
    return this.groupService.updateGroup(data);
  }

  @ApiOperation({ summary: '删除群组' })
  @Delete('del')
  remove(@Query('id') id: number) {
    return this.groupService.removeGroup(id);
  }
}
