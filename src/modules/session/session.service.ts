import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sessionEntity } from 'src/entities/session.entity';
import { MateService } from '../mate/mate.service';
import { Msg } from 'src/commom/constants/base-msg.const';
import { ResultList, ResultMsg } from 'src/commom/utils/result';
import { FindAllSessionDto } from './dto/findall-session.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FindOneSessionDto } from './dto/findone-session.dto';
import { GroupService } from '../group/group.service';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

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

      if (chat_type === 'personal') {
        // 查询是否为好友
        const mateRes = await this.mateService.findOneMateBymateId({
          mate_id: session_id,
          mate_status: 'agreed',
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
            newSession.mate = mateRes;
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

      if (chat_type === 'group') {
        const groupRes =
          await this.groupService.findOneGroupBygroupId(session_id);
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
  async findOneSession(query: FindOneSessionDto) {
    const { id, session_id, msg_status, chat_type } = query || {};
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
    if (chat_type === 'personal') {
      qb.leftJoinAndSelect('session.mate', 'mate');
    }
    if (chat_type === 'group') {
      qb.innerJoinAndSelect('session.group', 'group').innerJoinAndSelect(
        'group.members',
        'member',
      );
    }
    const session = await qb.getOne();
    return session;
  }

  /* 查询用户会话列表 */
  async findAllSessionByUid(query: FindAllSessionDto) {
    const {
      pageNum = 1,
      pageSize = 10,
      uid,
      msg_status,
      chat_type,
    } = query || {};
    const qb = this.sessionRepository.createQueryBuilder('session');

    // 1. 处理会话类型条件
    if (chat_type === 'personal') {
      qb.leftJoinAndSelect('session.mate', 'mate').where(
        'mate.apply_uid = :uid OR mate.agree_uid = :uid',
        { uid },
      );
    } else if (chat_type === 'group') {
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
      qb.orderBy('msgs.create_time', 'DESC');
    } else {
      qb.orderBy('session.update_time', 'DESC');
    }

    // 3. 分页逻辑
    const count = await qb.getCount();
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const data = await qb.getMany();

    let newdata = [];
    if (data.length) {
      newdata = data.map((item) => {
        if (item.chat_type === 'personal') {
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
        if (item.chat_type === 'group') {
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
    if (sessionRes) {
      if (msg_status === 'unread') {
        sessionData.unread_count = sessionRes.unread_count + 1;
      }
      const updatePost = this.sessionRepository.merge(sessionRes, sessionData);
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
    if (sessionRes) {
      const updatePost = this.sessionRepository.merge(sessionRes, {
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

  /* 删除会话 */
  async removeSession(id: number) {
    const delRes = await this.sessionRepository
      .createQueryBuilder('session')
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
