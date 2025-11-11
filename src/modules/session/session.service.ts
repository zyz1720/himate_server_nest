import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sessionEntity } from 'src/entities/session.entity';
import { MateService } from '../mate/mate.service';
import { Msg } from 'src/common/constants/base-msg.const';
import { ResultList, ResultMsg } from 'src/common/utils/result';
import { FindAllSessionDto } from './dto/findall-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FindOneSessionDto } from './dto/findone-session.dto';
import { GroupService } from '../group/group.service';
import { QueryRunnerFactory } from 'src/common/factories/query-runner.factory';
import { mateEntity } from 'src/entities/mate.entity';
import {
  ChatType,
  MateStatus,
  MessageStatus,
} from 'src/common/constants/base-enum.const';
import { IdsDto } from 'src/common/dto/common.dto';

interface IIsUserSession {
  id?: number;
  session_id?: string;
  uid: number;
}

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(sessionEntity)
    private readonly sessionRepository: Repository<sessionEntity>,
    private readonly mateService: MateService,
    private readonly groupService: GroupService,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  /* 新建会话 */
  async createChatSession(data: CreateSessionDto) {
    const { creator_uid, session_id, chat_type } = data || {};
    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_sessionRepository =
        this.queryRunnerFactory.getRepository(sessionEntity);

      if (chat_type == ChatType.Personal) {
        // 查询是否为好友
        const mateRes = await this.mateService.findOneMateBymateId({
          mate_id: session_id,
          mate_status: MateStatus.Agreed,
        });
        if (mateRes) {
          const sessionData = {
            creator_uid,
            session_id,
            chat_type,
          };
          const newSession = tx_sessionRepository.create(sessionData);
          const insertRes = await tx_sessionRepository.insert(newSession);
          if (insertRes.identifiers.length) {
            newSession.mate = mateRes as mateEntity;
            const saveRes = await tx_sessionRepository.save(newSession);

            await this.queryRunnerFactory.commitTransaction();
            return ResultMsg.ok(Msg.CREATE_SUCCESS, saveRes);
          } else {
            await this.queryRunnerFactory.rollbackTransaction();
            return ResultMsg.fail(Msg.CREATE_FAIL);
          }
        } else {
          await this.queryRunnerFactory.rollbackTransaction();
          return ResultMsg.fail('还不是好友');
        }
      }

      if (chat_type == ChatType.Group) {
        const groupRes = await this.groupService.findOneGroup({
          group_id: session_id,
        });
        if (groupRes) {
          const sessionData = {
            creator_uid,
            session_id,
            chat_type,
          };
          const newSession = tx_sessionRepository.create(sessionData);
          const insertRes = await tx_sessionRepository.insert(newSession);
          if (insertRes.identifiers.length) {
            newSession.group = groupRes;
            const saveRes = await tx_sessionRepository.save(newSession);

            await this.queryRunnerFactory.commitTransaction();
            return ResultMsg.ok(Msg.CREATE_SUCCESS, saveRes);
          } else {
            await this.queryRunnerFactory.rollbackTransaction();
            return ResultMsg.fail(Msg.CREATE_FAIL);
          }
        } else {
          await this.queryRunnerFactory.rollbackTransaction();
          return ResultMsg.fail('不存在的群聊');
        }
      }
    } catch (error) {
      console.log(error);
      await this.queryRunnerFactory.rollbackTransaction();
      return ResultMsg.fail(Msg.CREATE_FAIL);
    }
  }

  /* 查询会话详情 */
  async findOneSession(query: FindOneSessionDto, _uid?: number) {
    const { id, session_id, msg_status, chat_type } = query || {};
    if (_uid) {
      const session = await this.isUserSession({ id, session_id, uid: _uid });
      if (!session) {
        return ResultMsg.fail(Msg.NO_PERMISSION);
      }
    }

    const qb = this.sessionRepository.createQueryBuilder('session');
    if (id) {
      qb.andWhere('session.id = :id ', { id });
    }
    if (session_id) {
      qb.andWhere('session.session_id = :session_id ', {
        session_id,
      });
    }
    if (msg_status) {
      qb.leftJoinAndSelect(
        'session.msgs',
        'msgs',
        'msgs.msg_status = :status',
        {
          status: msg_status,
        },
      );
      qb.addOrderBy('msgs.create_time', 'DESC');
    }
    if (chat_type) {
      qb.andWhere('session.chat_type = :type', { type: chat_type });
    }
    if (chat_type == ChatType.Personal) {
      qb.leftJoinAndSelect('session.mate', 'mate');
    }
    if (chat_type == ChatType.Group) {
      qb.innerJoinAndSelect('session.group', 'group').innerJoinAndSelect(
        'group.members',
        'member',
      );
    }
    const session = await qb.getOne();
    if (!session) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
    return ResultMsg.ok(Msg.GET_SUCCESS, session);
  }

  /* 查询是否是用户的会话  */
  async isUserSession(data: IIsUserSession) {
    const { id, session_id, uid } = data || {};
    const qb = this.sessionRepository.createQueryBuilder('session');
    if (id) {
      qb.where('session.id = :s_id', { s_id: id });
    }
    if (session_id) {
      qb.where('session.session_id = :se_id', { se_id: session_id });
    }
    qb.leftJoinAndSelect('session.mate', 'mate')
      .leftJoinAndSelect('session.group', 'group')
      .leftJoinAndSelect('group.members', 'member')
      .where(
        '(mate.apply_uid = :uid OR mate.agree_uid = :uid) OR (member.member_uid = :uid)',
        { uid },
      );
    const session = await qb.getOne();
    return session;
  }

  /* 查询用户会话列表 */
  async findAllSessionByUid(query: FindAllSessionDto, _uid?: number) {
    const {
      pageNum = 0,
      pageSize = 10,
      uid,
      msg_status,
      chat_type,
    } = query || {};

    if (_uid && _uid != uid) {
      return ResultMsg.fail(Msg.NO_PERMISSION);
    }

    const qb = this.sessionRepository.createQueryBuilder('session');
    // 1. 处理会话类型条件
    if (chat_type == ChatType.Personal) {
      qb.leftJoinAndSelect('session.mate', 'mate').where(
        'mate.apply_uid = :uid OR mate.agree_uid = :uid',
        { uid },
      );
    } else if (chat_type == ChatType.Group) {
      qb.leftJoinAndSelect('session.group', 'group')
        .leftJoinAndSelect('group.members', 'member')
        .where('member.member_uid = :uid', { uid });
    } else {
      qb.leftJoinAndSelect('session.mate', 'mate')
        .leftJoinAndSelect('session.group', 'group')
        .leftJoinAndSelect('group.members', 'member')
        .where(
          '(mate.apply_uid = :uid OR mate.agree_uid = :uid) OR (member.member_uid = :uid)',
          { uid },
        );
    }

    // 2. 处理消息状态过滤
    if (msg_status) {
      qb.leftJoinAndSelect(
        'session.msgs',
        'msgs',
        'msgs.msg_status = :status',
        { status: msg_status },
      );
    }
    qb.orderBy('session.update_time', 'DESC');

    // 3. 分页逻辑
    const count = await qb.getCount();
    qb.limit(pageSize);
    qb.offset(pageSize * pageNum);

    const data = await qb.getMany();

    let newdata = [];
    if (data.length) {
      newdata = data.map((item) => {
        if (item.chat_type == ChatType.Personal) {
          return {
            session_name:
              item.mate.apply_uid == uid
                ? item.mate.agree_remark
                : item.mate.apply_remark,
            session_avatar:
              item.mate.apply_uid == uid
                ? item.mate.agree_avatar
                : item.mate.apply_avatar,
            ...item,
          };
        }
        if (item.chat_type == ChatType.Group) {
          return {
            session_name: item.group.group_name,
            session_avatar: item.group.group_avatar,
            ...item,
          };
        }
      });
    }
    return ResultList.list(newdata, count);
  }

  /* 更新会话信息 */
  async updateSession(data: UpdateSessionDto) {
    const {
      id,
      msgId,
      msgdata,
      msg_type,
      msg_secret,
      send_uid,
      msg_status,
      chat_type,
    } = data || {};
    const sessionData = {
      last_msg: msgdata,
      last_msgId: msgId,
      last_msgUid: send_uid,
      last_msgType: msg_type,
      last_msgSecret: msg_secret,
      chat_type,
      unread_count: 0,
    };

    const sessionRes = await this.findOneSession({ id });
    if (sessionRes.success) {
      if (msg_status == MessageStatus.Unread) {
        sessionData.unread_count = sessionRes.data.unread_count + 1;
      }
      const updatePost = this.sessionRepository.merge(
        sessionRes.data,
        sessionData,
      );
      const updateRes = await this.sessionRepository.save(updatePost);
      if (updateRes) {
        return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes);
      } else {
        return ResultMsg.fail(Msg.UPDATE_FAIL);
      }
    } else {
      return ResultMsg.fail('不存在的会话');
    }
  }

  /* 更新会话信息未读数 */
  async updateSessionUnreadCount(id: number) {
    const sessionRes = await this.findOneSession({ id });
    if (sessionRes.success) {
      const updatePost = this.sessionRepository.merge(sessionRes.data, {
        unread_count: 0,
      });
      const updateRes = await this.sessionRepository.save(updatePost);
      if (updateRes) {
        return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes);
      } else {
        return ResultMsg.fail(Msg.UPDATE_FAIL);
      }
    } else {
      return ResultMsg.fail('不存在的会话');
    }
  }

  /* 软删除会话 */
  async removeSession(id: number, _uid?: number) {
    if (_uid) {
      const session = await this.isUserSession({ id, uid: _uid });
      if (!session) {
        return ResultMsg.fail(Msg.NO_PERMISSION);
      }
    }
    const delRes = await this.sessionRepository
      .createQueryBuilder('session')
      .softDelete()
      .where('id = :id', { id })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 恢复会话 */
  async restoreSession(data: IdsDto) {
    const { ids = [] } = data || {};
    const delRes = await this.sessionRepository
      .createQueryBuilder('session')
      .restore()
      .where('id IN (:...ids)', { ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_RESTORE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.RESTORE_FAIL);
    }
  }

  /* 真刪除会话*/
  async realDeleteSession(data: IdsDto) {
    const { ids = [] } = data || {};
    const delRes = await this.sessionRepository
      .createQueryBuilder('session')
      .delete()
      .where('id IN (:...ids)', { ids })
      .andWhere('delete_time IS NOT NULL')
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }
}
