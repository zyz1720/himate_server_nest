import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/constants/database-enum.const';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiOkRes,
  ApiOkPageRes,
  ApiOkMsgRes,
} from 'src/common/response/api-response.decorator';
import { UserEntity } from './entity/user.entity';

@ApiTags('admin - 用户管理')
@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @ApiOkRes(UserEntity)
  @Post()
  create(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @ApiOperation({ summary: '获取所有用户信息' })
  @ApiOkPageRes(UserEntity)
  @Get()
  findAll(@Query() query: FindAllUserDto) {
    return this.userService.findAllUser(query);
  }

  @ApiOperation({ summary: '获取指定用户信息' })
  @ApiOkRes(UserEntity)
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.userService.findOneUser({ id });
  }

  @ApiOperation({ summary: '修改用户信息' })
  @ApiOkRes(UserEntity)
  @Put(':id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @ApiOperation({ summary: '软删除用户' })
  @ApiOkMsgRes()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.softDeleteUser(id);
  }

  @ApiOperation({ summary: '恢复用户' })
  @ApiOkMsgRes()
  @Put(':id/restore')
  restore(@Param('id') id: number) {
    return this.userService.restoreUser(id);
  }

  @ApiOperation({ summary: '真删除用户' })
  @ApiOkMsgRes()
  @Delete(':id/force')
  realRemove(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
