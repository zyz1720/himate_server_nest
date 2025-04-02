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
  Request as Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/commom/constants/base-enum.const';
import { Roles, Public } from 'src/core/auth/roles.decorator';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UserLoginBypasswordDto } from './dto/user-login-password.dto';
import { MailOrAccountValidationPipe } from './pipe/mail-or-account.pipe';
import { UserLoginBycodeDto } from './dto/user-login-code.dto';
import { FindAllUserDto } from './dto/findAll-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneUserDto } from './dto/findOne-user.dto';
import { BooleanFromStringPipe } from 'src/commom/pipe/string-boolean.pipe';
import { Request } from 'express';

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
  async userReg(@Body() user: RegisterUserDto) {
    return await this.userService.registerUser(user);
  }

  @ApiOperation({ summary: '用户登录（邮箱或账号只填写其中一个即可）' })
  @Public()
  @Post('login')
  async userlogin(
    @Body(new MailOrAccountValidationPipe()) user: UserLoginBypasswordDto,
  ) {
    return await this.authService.userlogin(user);
  }

  @ApiOperation({ summary: '验证码登录' })
  @Public()
  @Post('codelogin')
  async usercodelogin(@Body() user: UserLoginBycodeDto) {
    return await this.authService.userloginBycode(user);
  }

  @ApiOperation({ summary: '邮箱验证' })
  @Public()
  @Post('validate')
  async uservalidate(@Body() user: UserLoginBycodeDto) {
    return await this.userService.validateUser(user);
  }

  @ApiOperation({ summary: '创建用户' })
  @Roles(Role.Admin)
  @Post('add')
  async create(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }

  @ApiOperation({ summary: '获取所有用户信息' })
  @Roles(Role.Admin)
  @Get('list')
  async findAll(@Query(BooleanFromStringPipe) query: FindAllUserDto) {
    return await this.userService.findAllUser(query);
  }

  @ApiOperation({ summary: '获取指定用户信息' })
  @Get('detail')
  async findById(@Query() query: FindOneUserDto) {
    return await this.userService.findOneUser(query);
  }

  @ApiOperation({ summary: '修改用户信息' })
  @Put('edit')
  async update(@Body() body: UpdateUserDto, @Req() req: Request) {
    const updateUserDto = UpdateUserDto.fromRequest(body, req);
    return await this.userService.updateUser(updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @Roles(Role.Admin)
  @Delete('del')
  async remove(@Query('id') id: number) {
    return await this.userService.removeUser(id);
  }
}
