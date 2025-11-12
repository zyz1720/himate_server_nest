import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userEntity } from './entity/user.entity';
import { RedisService } from 'src/core/Redis/redis.service';
import { StringUtil } from 'src/common/utils/string.util';
import { UserLoginByCodeDto } from '../../core/auth/dto/user-login-code.dto';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AvatarUpdatedEvent } from './events/update-avatar.event';
import { UserNameUpdatedEvent } from './events/update-userName.event';
import { PageResponse, Response } from 'src/common/response/api-response';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { QueryRunnerFactory } from 'src/common/factories/query-runner.factory';
import { IdsDto } from 'src/common/dto/common.dto';
import { I18nService } from 'nestjs-i18n';
import {
  UpdateUserDto,
  UpdateUserPasswordDto,
  UpdateUserAccountDto,
} from './dto/update-user.dto';
import { Status } from 'src/common/constants/database-enum.const';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>,
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
    private readonly i18n: I18nService,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  /* 邮箱验证码验证用户 */
  async validateUser(data: UserLoginByCodeDto) {
    const { account, code } = data || {};
    const localCode = await this.redisService.getValue(account + 'code');

    if (code == localCode) {
      return Response.ok(this.i18n.t('message.VALIDATE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.CODE_ERROR'));
    }
  }

  /* 创建用户 */
  async createUser(user: CreateUserDto) {
    const { account } = user || {};
    const existUser = await this.findOneUser({ account }, false);
    if (existUser) {
      return Response.fail(this.i18n.t('message.ACCOUNT_EXIST'));
    }
    const newUser = this.userRepository.create(user);
    const insertRes = await this.userRepository.insert(newUser);
    if (insertRes.identifiers.length) {
      await this.redisService.delValue(account + 'code');
      return Response.ok(
        this.i18n.t('message.CREATE_SUCCESS'),
        insertRes.generatedMaps[0],
      );
    } else {
      return Response.fail(this.i18n.t('message.CREATE_FAILED'));
    }
  }

  /* 用户注册 */
  async registerUser(data: RegisterUserDto) {
    const validateRes = await this.validateUser(data);
    if (validateRes.code !== 0) {
      return validateRes;
    }
    const createRes = await this.createUser(data);
    return createRes;
  }

  /* 获取用户信息 */
  async findOneUser(query: FindOneUserDto, isEnable = true) {
    const { id, account, self_account, password } = query || {};

    const qb = this.userRepository.createQueryBuilder('user');
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
      const enPassword = StringUtil.encryptStr(password);
      qb.andWhere('user.password = :enPassword', { enPassword });
    }
    if (isEnable) {
      qb.andWhere('user.user_status = :status', { status: Status.Enabled });
    }
    const data = await qb.getOne();
    return data;
  }

  /* 获取用户通过账号/自定义账号 密码 */
  async findUserByAP(account: string, password: string) {
    const enPassword = StringUtil.encryptStr(password);
    const qb = this.userRepository.createQueryBuilder('user');
    qb.where('user.account = :account', { account });
    qb.orWhere('user.self_account = :account', { account });
    qb.andWhere('user.password = :enPassword', { enPassword });
    const user = await qb.getOne();
    return user;
  }

  /* 获取用户列表 */
  async findAllUser(query: FindAllUserDto) {
    const {
      current = 1,
      pageSize = 10,
      account,
      self_account,
      user_role,
      sex,
      user_status,
    } = query || {};
    const qb = this.userRepository.createQueryBuilder('user');
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
    qb.limit(pageSize);
    qb.offset(pageSize * (current - 1));
    const data = await qb.getMany();
    return PageResponse.list(data, count);
  }

  /* 更新用户信息 */
  async updateUser(id: number, data: UpdateUserDto, isEnable?: boolean) {
    const { user_name, user_avatar, password } = data;
    const existPost = await this.findOneUser({ id }, isEnable);
    if (!existPost) {
      return Response.fail(this.i18n.t('message.DATA_NOEXIST'));
    }
    if (password) {
      data.password = StringUtil.encryptStr(password);
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
          return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
        } else {
          await this.queryRunnerFactory.commitTransaction();
          return Response.ok(this.i18n.t('message.UPDATE_SUCCESS'), saveRes);
        }
      } else {
        await this.queryRunnerFactory.rollbackTransaction();
        return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
      }
    } catch (error) {
      await this.queryRunnerFactory.rollbackTransaction();
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
  }

  /* 更新用户密码 */
  async updateUserPassword(id: number, data: UpdateUserPasswordDto) {
    const { password, oldPassword, code } = data;

    const existUser = await this.findOneUser({ id, password: oldPassword });
    if (!existUser) {
      return Response.fail(this.i18n.t('message.PASSWORD_ERROR'));
    }
    const localCode = await this.redisService.getValue(
      existUser.account + 'code',
    );
    if (localCode !== code) {
      return Response.fail(this.i18n.t('message.CODE_ERROR'));
    }
    existUser.password = StringUtil.encryptStr(password);
    const saveRes = await this.userRepository.save(existUser);
    if (!saveRes) {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
    return Response.ok(this.i18n.t('message.UPDATE_SUCCESS'));
  }

  /* 更新用户账号 */
  async updateUserAccount(id: number, data: UpdateUserAccountDto) {
    const { newAccount, code } = data;

    const existUser = await this.findOneUser({ account: newAccount });
    if (existUser) {
      return Response.fail(this.i18n.t('message.ACCOUNT_EXIST'));
    }
    const user = await this.findOneUser({ id });
    const localCode = await this.redisService.getValue(user.account + 'code');
    if (localCode !== code) {
      return Response.fail(this.i18n.t('message.CODE_ERROR'));
    }
    user.account = newAccount;
    const saveRes = await this.userRepository.save(user);
    if (!saveRes) {
      return Response.fail(this.i18n.t('message.UPDATE_FAILED'));
    }
    return Response.ok(this.i18n.t('message.UPDATE_SUCCESS'));
  }

  /* 软删除用户 */
  async softDeleteUser(id: number) {
    const result = await this.userRepository.softDelete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 恢复用户 */
  async restoreUser(id: number) {
    const result = await this.userRepository.restore(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.RESTORE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 真删除用户 */
  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected) {
      return Response.ok(this.i18n.t('message.DELETE_SUCCESS'));
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 批量软刪除用户 */
  async BatchSoftDeleteUser(data: IdsDto) {
    const { ids = [] } = data || {};
    const qb = this.userRepository.createQueryBuilder('user').softDelete();
    qb.where('id IN (:...ids)', { ids });
    const delRes = await qb.execute();
    if (delRes.affected) {
      return Response.ok(
        delRes.affected + this.i18n.t('message.BATCH_DELETE_SUCCESS'),
      );
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }

  /* 批量恢复用户数据 */
  async BatchRestoreUser(data: IdsDto) {
    const { ids = [] } = data || {};
    const delRes = await this.userRepository
      .createQueryBuilder('user')
      .restore()
      .where('id IN (:...ids)', { ids })
      .execute();
    if (delRes.affected) {
      return Response.ok(
        delRes.affected + this.i18n.t('message.BATCH_RESTORE_SUCCESS'),
      );
    } else {
      return Response.fail(this.i18n.t('message.RESTORE_FAILED'));
    }
  }

  /* 批量真刪除用户*/
  async BatchDeleteUser(data: IdsDto) {
    const { ids = [] } = data || {};
    const delRes = await this.userRepository
      .createQueryBuilder('user')
      .delete()
      .where('id IN (:...ids)', { ids })
      .andWhere('delete_time IS NOT NULL')
      .execute();
    if (delRes.affected) {
      return Response.ok(
        delRes.affected + this.i18n.t('message.BATCH_DELETE_SUCCESS'),
      );
    } else {
      return Response.fail(this.i18n.t('message.DELETE_FAILED'));
    }
  }
}
