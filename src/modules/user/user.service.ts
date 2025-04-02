import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userEntity } from '../../entities/user.entity';
import { RedisService } from 'src/core/Redis/redis.service';
import { encryptPassword } from 'src/commom/utils/base';
import { UserLoginBycodeDto } from './dto/user-login-code.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { FindAllUserDto } from './dto/findAll-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AvatarUpdatedEvent } from './events/update-avatar.event';
import { UserNameUpdatedEvent } from './events/update-userName.event';
import { ResultList, ResultMsg } from 'src/commom/utils/result';
import { Msg } from 'src/commom/constants/base-msg.const';
import { BaseConst } from 'src/commom/constants/base.const';
import { FindOneUserDto } from './dto/findOne-user.dto';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>,
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  /* 邮箱验证码验证用户 */
  async validateUser(data: UserLoginBycodeDto) {
    const { account, code } = data || {};
    const localCode = await this.redisService.getValue(account + 'code');

    if (code == localCode) {
      return ResultMsg.ok(Msg.VALIDATE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.VALIDATE_FAIL);
    }
  }

  /* 创建用户 */
  async createUser(user: CreateUserDto) {
    const { account, password } = user || {};
    // 设置默认密码
    if (!password) {
      user.password = BaseConst.DefaultUserPassword;
    }
    const doc = await this.findOneUser({ account });
    if (doc) {
      return ResultMsg.fail('用户已存在');
    }
    const newUser = this.userRepository.create(user);
    const insertRes = await this.userRepository.insert(newUser);
    if (insertRes.identifiers.length) {
      this.redisService.delValue(account + 'code');
      return ResultMsg.ok(Msg.CREATE_SUCCESS, insertRes.generatedMaps[0]);
    } else {
      return ResultMsg.fail(Msg.CREATE_FAIL);
    }
  }

  /* 用户注册 */
  async registerUser(data: RegisterUserDto) {
    const validateRes = await this.validateUser(data);
    if (!validateRes.success) {
      return validateRes;
    }
    const createRes = await this.createUser(data);
    return createRes;
  }

  /* 获取用户信息 */
  async findOneUser(query: FindOneUserDto) {
    const { id, account, self_account, password } = query || {};
    const qb = this.userRepository.createQueryBuilder('user');
    qb.where('user.user_status = :status', { status: '1' });
    if (id) {
      qb.andWhere('user.id = :id', { id });
    }
    if (account) {
      qb.andWhere('user.account = :account', { account });
    }
    if (self_account) {
      qb.andWhere('user.self_account = :self_account', {
        self_account,
      });
    }
    if (password) {
      const enPassword = encryptPassword(password);
      qb.andWhere('user.password = :enPassword', { enPassword });
    }
    const data = await qb.getOne();
    return data;
  }

  /* 获取用户列表 */
  async findAllUser(query: FindAllUserDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      isPaging = true,
      ids,
      account,
      self_account,
      user_role,
      sex,
      user_status,
    } = query || {};
    const qb = this.userRepository.createQueryBuilder('user');
    if (ids) {
      qb.andWhere('user.id IN (:...ids)', { ids });
    }
    if (account) {
      qb.andWhere('user.account LIKE :account', { account: `%${account}%` });
    }
    if (self_account) {
      qb.andWhere('user.self_account LIKE :self_account', {
        self_account: `%${self_account}%`,
      });
    }
    if (user_role) {
      qb.andWhere('user.user_role = :user_role', { user_role });
    }
    if (sex) {
      qb.andWhere('user.sex = :sex', { sex });
    }
    if (user_status) {
      qb.andWhere('user.user_status = :user_status', { user_status });
    }
    qb.orderBy('user.create_time');
    const count = await qb.getCount();
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * (pageNum - 1));
    }
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /* 更新用户信息 */
  async updateUser(data: UpdateUserDto) {
    const {
      id,
      account,
      self_account,
      user_name,
      user_avatar,
      password,
      oldpassword,
    } = data;
    const existPost = await this.findOneUser({ id });
    if (!existPost) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
    if (account) {
      const accountRes = await this.findOneUser({ account });
      if (accountRes) {
        return ResultMsg.fail(Msg.DATA_EXIST);
      }
    }
    if (self_account) {
      const selfRes = await this.findOneUser({ self_account });
      if (selfRes) {
        return ResultMsg.fail(Msg.DATA_EXIST);
      }
    }
    if (oldpassword) {
      const passwordRes = await this.userRepository.findOne({
        where: { id, password: encryptPassword(oldpassword) },
      });
      if (!passwordRes) {
        return ResultMsg.fail(Msg.PASSWORD_ERROR);
      }
    }
    if (password) {
      data.password = encryptPassword(password);
    }
    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_userRepository =
        this.queryRunnerFactory.getRepository(userEntity);
      // 更新用户信息
      const updatePost = tx_userRepository.merge(existPost, data);
      const saveRes = await tx_userRepository.save(updatePost);
      const eventFlags: boolean[] = [];
      if (saveRes) {
        if (user_avatar) {
          const result = await this.eventEmitter.emitAsync(
            'avatar.updated',
            new AvatarUpdatedEvent(id, user_avatar),
          );
          eventFlags.push(...result);
        }
        if (user_name) {
          const result = await this.eventEmitter.emitAsync(
            'userName.updated',
            new UserNameUpdatedEvent(id, user_name),
          );
          eventFlags.push(...result);
        }
        // 事件有失败事务回滚
        if (eventFlags.includes(false)) {
          await this.queryRunnerFactory.rollbackTransaction();
          return ResultMsg.fail(Msg.UPDATE_FAIL);
        } else {
          await this.queryRunnerFactory.commitTransaction();
          return ResultMsg.ok(Msg.UPDATE_SUCCESS, saveRes);
        }
      } else {
        await this.queryRunnerFactory.rollbackTransaction();
        return ResultMsg.fail(Msg.UPDATE_FAIL);
      }
    } catch (error) {
      await this.queryRunnerFactory.rollbackTransaction();
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 假刪除用户 */
  async removeUser(id: number) {
    const existPost = await this.findOneUser({ id });
    if (!existPost) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
    const res = this.userRepository.merge(existPost, { user_status: '0' });
    const saveres = await this.userRepository.save(res);
    if (saveres) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 真刪除用户*/
  async deleteUser(id: number) {
    const delRes = await this.userRepository
      .createQueryBuilder('user')
      .delete()
      .where('id = :id', { id })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }
}
