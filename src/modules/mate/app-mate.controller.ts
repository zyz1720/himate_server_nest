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
import { MateService } from './mate.service';
import { AddUserMateDto } from './dto/add-mate.dto';
import { UpdateMateRemarksDto } from './dto/update-mate.dto';
import { MateEntity, MateStatusEnum } from './entity/mate.entity';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import { FindAllDto } from 'src/common/dto/common.dto';

@ApiTags('app - 好友')
@ApiBearerAuth()
@Controller('app/mate')
export class AppMateController {
  constructor(private readonly mateService: MateService) {}

  @ApiOperation({ summary: '添加好友' })
  @ApiOkRes(MateEntity)
  @Post()
  create(@UserId() uid: number, @Body() data: AddUserMateDto) {
    return this.mateService.addUserMate(uid, data);
  }

  @ApiOperation({ summary: '好友列表' })
  @ApiOkPageRes(MateEntity)
  @Get('friend')
  findAllFriend(@UserId() uid: number, @Query() query: FindAllDto) {
    return this.mateService.findAllUserMate(uid, query);
  }

  @ApiOperation({ summary: '用户间的好友关系' })
  @ApiOkRes(MateEntity)
  @Get('relation/:userId')
  findRelation(@UserId() uid: number, @Param('userId') userId: number) {
    return this.mateService.verifyTwoUserIsMate(
      uid,
      userId,
      MateStatusEnum.agreed,
    );
  }

  @ApiOperation({ summary: '申请我为好友的列表' })
  @ApiOkPageRes(MateEntity)
  @Get('waiting')
  findAllWaiting(@UserId() uid: number, @Query() query: FindAllDto) {
    return this.mateService.findAllUserApplyMate(
      uid,
      query,
      MateStatusEnum.waiting,
    );
  }

  @ApiOperation({ summary: '我已拒绝的好友申请列表' })
  @ApiOkPageRes(MateEntity)
  @Get('rejected')
  findAllRejected(@UserId() uid: number, @Query() query: FindAllDto) {
    return this.mateService.findAllUserApplyMate(
      uid,
      query,
      MateStatusEnum.refused,
    );
  }

  @ApiOperation({ summary: '修改好友备注' })
  @ApiOkRes(MateEntity)
  @Put('remarks/:id')
  update(
    @UserId() uid: number,
    @Param('id') id: string,
    @Body() data: UpdateMateRemarksDto,
  ) {
    return this.mateService.updateMateRemarks(uid, parseInt(id), data);
  }

  @ApiOperation({ summary: '同意好友申请' })
  @ApiOkRes(MateEntity)
  @Put('agree/:id')
  agree(
    @UserId() uid: number,
    @Param('id') id: string,
    @Body() data: UpdateMateRemarksDto,
  ) {
    return this.mateService.updateMateStatus(
      uid,
      parseInt(id),
      MateStatusEnum.agreed,
      data,
    );
  }

  @ApiOperation({ summary: '拒绝好友' })
  @ApiOkRes(MateEntity)
  @Put('refuse/:id')
  refuse(@UserId() uid: number, @Param('id') id: string) {
    return this.mateService.updateMateStatus(
      uid,
      parseInt(id),
      MateStatusEnum.refused,
    );
  }

  @ApiOperation({ summary: '删除好友' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@UserId() uid: number, @Param('id') id: string) {
    return this.mateService.softDeleteUserMate(uid, parseInt(id));
  }
}
