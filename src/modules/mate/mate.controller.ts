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
import { MateService } from './mate.service';
import { AddMateDto } from './dto/add-mate.dto';
import { UpdateMateDto } from './dto/update-mate.dto';
import { FindAllMateDto } from './dto/find-all-mate.dto';
import { MateEntity } from './entity/mate.entity';

@ApiTags('好友管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('mate')
export class MateController {
  constructor(private readonly mateService: MateService) {}

  @ApiOperation({ summary: '添加好友' })
  @ApiOkRes(MateEntity)
  @Post()
  create(@Body() data: AddMateDto) {
    return this.mateService.addMate(data);
  }

  @ApiOperation({ summary: '好友列表' })
  @ApiOkPageRes(MateEntity)
  @Get()
  findAll(@Query() query: FindAllMateDto) {
    return this.mateService.findAllMate(query);
  }

  @ApiOperation({ summary: '获取好友详情' })
  @ApiOkRes(MateEntity)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mateService.findOneMate(parseInt(id));
  }

  @ApiOperation({ summary: '修改好友信息' })
  @ApiOkRes(MateEntity)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateMateDto) {
    return this.mateService.updateMate(parseInt(id), data);
  }

  @ApiOperation({ summary: '软删除好友' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mateService.softDeleteMate(parseInt(id));
  }

  @ApiOperation({ summary: '恢复好友' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: string) {
    return this.mateService.restoreMate(parseInt(id));
  }

  @ApiOperation({ summary: '真删除好友' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.mateService.deleteMate(parseInt(id));
  }
}
