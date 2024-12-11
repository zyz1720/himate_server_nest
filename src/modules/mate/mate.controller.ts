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
import { FindAllMateDto } from './dto/findall-mate.dto';
import { FindMateStatusDto } from './dto/findstatus-mate.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindMateBymIdDto } from './dto/findbymId-mate.dto';

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
  findAllbyId(@Query() query: FindAllMateDto) {
    return this.mateService.findUserMate(query);
  }

  @ApiOperation({ summary: '查询好友关系mate_id' })
  @Get('detailBymId')
  findOnebymateId(@Query() query: FindMateBymIdDto) {
    return this.mateService.findOneMateBymateId(query);
  }

  @ApiOperation({ summary: '查询申请者列表' })
  @Get('applylist')
  findAllbymateId(@Query() query: FindAllMateDto) {
    return this.mateService.findAllApplyUser(query);
  }

  @ApiOperation({ summary: '查询两个用户好友关系' })
  @Get('ismate')
  findIsMate(@Query() query: FindMateStatusDto) {
    return this.mateService.findUserMateStatus(query);
  }

  @ApiOperation({ summary: '修改好友信息' })
  @Put('edit')
  async update(@Body() data: UpdateMateDto) {
    return await this.mateService.updateMate(data);
  }

  @ApiOperation({ summary: '删除好友' })
  @Delete('del')
  remove(@Query('id') id: number) {
    return this.mateService.delMate(id);
  }
}
