import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chatEntity } from 'src/entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { FindAllChatDto } from './dto/findall-chat.dto';
import { Msg } from 'src/commom/constants/base-msg.const';
import { ResultMsg, ResultList } from 'src/commom/utils/result';
import { UpdateChatDto } from './dto/update-chat.dto';
import { SessionService } from '../session/session.service';
import { IdsDto } from 'src/commom/dto/commom.dto';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';
import { NumericStatus } from 'src/commom/constants/base-enum.const';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(chatEntity)
    private readonly chatRepository: Repository<chatEntity>,
    private readonly sessionService: SessionService,
    private readonly queryRunnerFactory: QueryRunnerFactory,
  ) {}

  /* 添加一条消息 */
  async createChatmsg(data: CreateChatDto) {
    const sessionRes = await this.sessionService.findOneSession(data);
    if (!sessionRes.success) {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }

    let Result = null;
    try {
      // 开启事务
      await this.queryRunnerFactory.startTransaction();
      const tx_chatRepository =
        this.queryRunnerFactory.getRepository(chatEntity);
      // 执行一些数据库操作
      const chatData = tx_chatRepository.create(data);
      const insertRes = await tx_chatRepository.insert(chatData);
      if (insertRes.identifiers.length) {
        chatData.session = sessionRes.data;
        const saveRes = await tx_chatRepository.save(chatData);
        if (saveRes) {
          Result = saveRes;
        }
      }
      if (Result) {
        await this.queryRunnerFactory.commitTransaction();
        return ResultMsg.ok(Msg.CREATE_SUCCESS, Result);
      } else {
        await this.queryRunnerFactory.rollbackTransaction();
        return ResultMsg.fail(Msg.CREATE_FAIL);
      }
    } catch (error) {
      console.log(error);
      await this.queryRunnerFactory.rollbackTransaction();
      return ResultMsg.fail(Msg.CREATE_FAIL);
    }
  }

  /* 查询所有消息 */
  async findAllChatmsg(query: FindAllChatDto, uid?: number) {
    const {
      send_uid,
      msg_type,
      chat_type,
      msgdata,
      msg_status,
      session_id,
      pageNum = 0,
      pageSize = 10,
      isPaging = NumericStatus.True,
    } = query || {};
    const qb = this.chatRepository.createQueryBuilder('chat');
    if (send_uid) {
      qb.andWhere('send_uid = :send_uid', { send_uid });
    }
    if (session_id) {
      qb.andWhere('session_id = :session_id', { session_id });
    }
    if (msg_type) {
      qb.andWhere('msg_type = :msg_type', { msg_type });
    }
    if (msg_status) {
      qb.andWhere('msg_status = :msg_status', { msg_status });
    }
    if (msgdata) {
      qb.andWhere('msgdata LIKE :msgdata', { msgdata: `%${msgdata}%` });
    }
    if (chat_type) {
      qb.andWhere('chat_type = :chat_type', { chat_type });
    }
    if (uid) {
      qb.andWhere('send_uid = :uid', { uid });
    }
    qb.orderBy('create_time', 'DESC');
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * pageNum);
    }

    const count = await qb.getCount();
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /*  查询指定消息 */
  async findOneChatmsgbyId(id: number, uid?: number) {
    const qb = this.chatRepository.createQueryBuilder('chat');
    qb.where('id = :id', { id });
    if (uid) {
      qb.andWhere('send_uid = :uid', { uid });
    }
    const chatRes = await qb.getOne();
    return chatRes;
  }

  /* 修改聊天信息 */
  async updateChatmsg(data: UpdateChatDto, uid?: number) {
    const { id } = data || {};
    delete data.id;
    const qb = this.chatRepository.createQueryBuilder('chat').update();
    qb.where('id = :id', { id });
    if (uid) {
      qb.andWhere('send_uid = :uid', { uid });
    }
    const updateRes = await qb.set({ ...data }).execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes.generatedMaps[0]);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 软删除某个会话的全部聊天信息 */
  async removeMoreChatmsg(session_id: string) {
    const delRes = await this.chatRepository
      .createQueryBuilder('chat')
      .softDelete()
      .where('session_id = :id', { id: session_id })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 软删除聊天信息 */
  async softDeleteChatmsg(data: IdsDto, uid?: number) {
    const { ids } = data || {};
    const qb = this.chatRepository.createQueryBuilder('chat').softDelete();
    qb.where('id IN (:...ids)', { ids });
    if (uid) {
      qb.andWhere('send_uid = :uid', { uid });
    }
    const delRes = await qb.execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 恢复聊天信息 */
  async restoreChatmsg(data: IdsDto) {
    const { ids = [] } = data || {};
    const delRes = await this.chatRepository
      .createQueryBuilder('chat')
      .restore()
      .where('id IN (:...ids)', { ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_RESTORE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.RESTORE_FAIL);
    }
  }

  /* 真刪除聊天信息*/
  async deleteChatmsg(data: IdsDto) {
    const { ids = [] } = data || {};
    const delRes = await this.chatRepository
      .createQueryBuilder('chat')
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
