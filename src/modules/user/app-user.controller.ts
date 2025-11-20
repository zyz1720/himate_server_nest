import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Post,
  Get,
  Put,
  Query,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { RegisterUserDto } from './dto/create-user.dto';
import { UserId } from 'src/core/auth/decorators/user.decorator';
import {
  ApiOkRes,
  ApiOkMsgRes,
} from 'src/common/response/api-response.decorator';
import { UserEntity } from './entity/user.entity';
import {
  AppUpdateUserDto,
  UpdateUserPasswordDto,
  UpdateUserAccountDto,
} from './dto/update-user.dto';
import { SearchOneUserEnabledDto } from './dto/find-one-user.dto';

@ApiTags('app - 用户')
@ApiBearerAuth()
@Controller('app/user')
export class AppUserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '用户注册' })
  @Public()
  @Post('reg')
  userReg(@Body() user: RegisterUserDto) {
    return this.userService.registerUser(user);
  }

  @ApiOperation({ summary: '获取用户信息' })
  @ApiOkRes(UserEntity)
  @Get('info')
  userInfo(@UserId() uid: number) {
    return this.userService.findOneUserEnabled({ id: uid });
  }

  @ApiOperation({ summary: '修改用户信息' })
  @ApiOkRes(UserEntity)
  @Put('info')
  update(@UserId() uid: number, @Body() body: AppUpdateUserDto) {
    return this.userService.updateUserEnabled(uid, body);
  }

  @ApiOperation({ summary: '修改用户密码' })
  @ApiOkMsgRes()
  @Put('password')
  updatePassword(@UserId() uid: number, @Body() body: UpdateUserPasswordDto) {
    return this.userService.updateUserPassword(uid, body);
  }

  @ApiOperation({ summary: '修改用户账号' })
  @ApiOkMsgRes()
  @Put('account')
  updateAccount(@UserId() uid: number, @Body() body: UpdateUserAccountDto) {
    return this.userService.updateUserAccount(uid, body);
  }

  @ApiOperation({ summary: '用户注销' })
  @ApiOkMsgRes()
  @Delete('logout')
  remove(@UserId() uid: number) {
    return this.userService.softDeleteUser(uid);
  }

  @ApiOperation({ summary: '搜索其他用户' })
  @ApiOkRes(UserEntity)
  @Get('search')
  search(@Query() query: SearchOneUserEnabledDto) {
    return this.userService.searchUserEnabled(query);
  }

  @ApiOperation({ summary: '获取其他用户详情' })
  @ApiOkRes(UserEntity)
  @Get('detail/:id')
  detail(@Param('id') id: number) {
    return this.userService.findOneUserEnabledDetail(id);
  }
}
