import { UserService } from './user.service';
import { AuthService } from '../../core/auth/auth.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/commom/constants/base-enum.const';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Public } from 'src/core/auth/decorators/public.decorator';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UserLoginBypasswordDto } from './dto/user-login-password.dto';
import { MailOrAccountValidationPipe } from './pipe/mail-or-account.pipe';
import { UserLoginBycodeDto } from './dto/user-login-code.dto';
import { FindAllUserDto } from './dto/findall-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneUserDto } from './dto/findone-user.dto';
import { EmptyQueryPipe } from 'src/commom/pipe/empty-query.pipe';
import { IdsDto } from 'src/commom/dto/commom.dto';
import { UserId } from 'src/core/auth/decorators/user.decorator';

@ApiTags('用户信息')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '用户注册' })
  @Public()
  @Post('reg')
  userReg(@Body() user: RegisterUserDto) {
    return this.userService.registerUser(user);
  }

  @ApiOperation({ summary: '用户登录（邮箱或账号只填写其中一个即可）' })
  @Public()
  @Post('login')
  userlogin(@Body(MailOrAccountValidationPipe) user: UserLoginBypasswordDto) {
    return this.authService.userlogin(user);
  }

  @ApiOperation({ summary: '验证码登录' })
  @Public()
  @Post('codelogin')
  usercodelogin(@Body() user: UserLoginBycodeDto) {
    return this.authService.userloginBycode(user);
  }

  @ApiOperation({ summary: '邮箱验证' })
  @Public()
  @Post('validate')
  uservalidate(@Body() user: UserLoginBycodeDto) {
    return this.userService.validateUser(user);
  }

  @ApiOperation({ summary: '创建用户' })
  @Roles(Role.Admin)
  @Post('add')
  create(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @ApiOperation({ summary: '获取所有用户信息' })
  @Roles(Role.Admin)
  @Get('list')
  findAll(@Query() query: FindAllUserDto) {
    return this.userService.findAllUser(query);
  }

  @ApiOperation({ summary: '获取指定用户信息' })
  @Get('detail')
  findById(@Query(EmptyQueryPipe) query: FindOneUserDto) {
    return this.userService.findOneUser(query);
  }

  @ApiOperation({ summary: '修改用户信息' })
  @Put('edit')
  update(@Body() body: UpdateUserDto, @UserId() uid: number) {
    return this.userService.updateUser(body, uid);
  }

  @ApiOperation({ summary: '软删除用户' })
  @Delete('del')
  remove(@Body() data: IdsDto, @UserId() uid: number) {
    return this.userService.softDeleteUser(data, uid);
  }

  @ApiOperation({ summary: '恢复用户' })
  @Roles(Role.Admin)
  @Post('restore')
  restore(@Body() data: IdsDto) {
    return this.userService.restoreUser(data);
  }

  @ApiOperation({ summary: '真删除用户' })
  @Roles(Role.Admin)
  @Delete('realDel')
  realRemove(@Body() data: IdsDto) {
    return this.userService.deleteUser(data);
  }
}
