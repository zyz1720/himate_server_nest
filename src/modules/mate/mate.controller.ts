import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Delete,
} from '@nestjs/common';
import { MateService } from './mate.service';
import { CreateMateDto } from './dto/create-mate.dto';
import { UpdateMateDto } from './dto/update-mate.dto';
import { FindAllMateDto, FindAllMatelistDto } from './dto/findall-mate.dto';
import { FindMateStatusDto } from './dto/findstatus-mate.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindMateBymIdDto } from './dto/findbymId-mate.dto';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { UpdateAllMateDto } from './dto/updateall-mate.dto';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Role } from 'src/common/constants/base-enum.const';
import { IdsDto } from 'src/common/dto/common.dto';

@ApiTags('好友')
@ApiBearerAuth()
@Controller('mate')
export class MateController {
  constructor(private readonly mateService: MateService) {}

  @ApiOperation({ summary: '添加好友' })
  @Post('add')
  async create(@Body() data: CreateMateDto) {
    return await this.mateService.addMate(data);
  }

  @ApiOperation({ summary: '查询用户好友列表' })
  @Get('list')
  findAllbyId(@Query() query: FindAllMateDto, @UserId() uid: number) {
    return this.mateService.findUserMate(query, uid);
  }

  @ApiOperation({ summary: '查询好友关系mate_id' })
  @Get('detailBymId')
  findOnebymateId(@Query() query: FindMateBymIdDto, @UserId() uid: number) {
    return this.mateService.findOneMateBymateId(query, uid);
  }

  @ApiOperation({ summary: '查询申请者列表' })
  @Get('applylist')
  findAllbymateId(@Query() query: FindAllMateDto, @UserId() uid: number) {
    return this.mateService.findAllApplyUser(query, uid);
  }

  @ApiOperation({ summary: '查询两个用户好友关系' })
  @Get('ismate')
  findIsMate(@Query() query: FindMateStatusDto, @UserId() uid: number) {
    return this.mateService.findUserMateStatus(query, uid);
  }

  @ApiOperation({ summary: '修改好友信息' })
  @Put('edit')
  async edit(@Body() data: UpdateMateDto, @UserId() uid: number) {
    return await this.mateService.updateMate(data, uid);
  }

  @ApiOperation({ summary: '软删除好友' })
  @Delete('del')
  remove(@Query('id') id: number, @UserId() uid: number) {
    return this.mateService.delMate(id, uid);
  }

  @ApiOperation({ summary: '查询所有好友关系' })
  @Roles(Role.Admin)
  @Get('alllist')
  findAllMate(@Query() query: FindAllMatelistDto) {
    return this.mateService.findAllMateList(query);
  }

  @ApiOperation({ summary: '修改好友关系的所有信息' })
  @Roles(Role.Admin)
  @Put('editall')
  async update(@Body() data: UpdateAllMateDto) {
    return await this.mateService.updateMateAll(data);
  }

  @ApiOperation({ summary: '软删除好友关系' })
  @Roles(Role.Admin)
  @Delete('softdel')
  softDelete(@Body() data: IdsDto) {
    return this.mateService.softDeleteMate(data);
  }

  @ApiOperation({ summary: '恢复好友关系' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Body() data: IdsDto) {
    return this.mateService.restoreMate(data);
  }

  @ApiOperation({ summary: '真删除好友关系' })
  @Roles(Role.Admin)
  @Delete('realDel')
  realRemove(@Body() data: IdsDto) {
    return this.mateService.realDeleteMate(data);
  }
}
