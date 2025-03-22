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
import { DateDto, IdsDto } from 'src/commom/dto/commom.dto';
import { QueryRunnerFactory } from 'src/commom/factories/query-runner.factory';

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
    const session = await this.sessionService.findOneSession(data);
    if (!session) {
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
        chatData.session = session;
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
  async findAllChatmsg(query: FindAllChatDto) {
    const {
      send_uid,
      msg_type,
      chat_type,
      msgdata,
      msg_status,
      session_id,
      pageNum = 1,
      pageSize = 10,
      isPaging = true,
    } = query || {};
    const qb = this.chatRepository.createQueryBuilder('chat');
    if (send_uid) {
      qb.andWhere('chat.send_uid = :send_uid', { send_uid });
    }
    if (session_id) {
      qb.andWhere('chat.session_id = :session_id', { session_id });
    }
    if (msg_type) {
      qb.andWhere('chat.msg_type = :msg_type', { msg_type });
    }
    if (msg_status) {
      qb.andWhere('chat.msg_status = :msg_status', { msg_status });
    }
    if (msgdata) {
      qb.andWhere('chat.msgdata LIKE :msgdata', { msgdata: `%${msgdata}%` });
    }
    if (chat_type) {
      qb.andWhere('chat.chat_type = :chat_type', { chat_type });
    }
    qb.orderBy('chat.create_time', 'DESC');
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * (pageNum - 1));
    }

    const count = await qb.getCount();
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /*  查询指定消息 */
  async findOneChatmsgbyId(id: number) {
    const Chatres = await this.chatRepository.findOne({
      where: { id },
    });
    return Chatres;
  }

  /* 修改聊天信息 */
  async updateChatmsg(data: UpdateChatDto) {
    const { id } = data || {};
    delete data.id;
    const updateRes = await this.chatRepository
      .createQueryBuilder('chat')
      .update()
      .set({ ...data })
      .where('chat.id = :id', { id })
      .execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes.generatedMaps[0]);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 删除聊天信息 */
  async removeChatmsg(data: IdsDto) {
    const { ids } = data || {};
    const delRes = await this.chatRepository
      .createQueryBuilder('chat')
      .delete()
      .where('id IN (:...ids)', { ids: ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 删除某个会话的全部聊天信息 */
  async removeMoreChatmsg(session_id: string) {
    const delRes = await this.chatRepository
      .createQueryBuilder('chat')
      .delete()
      .where('chat.session_id = :id', { id: session_id })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 删除某段时间之前的已读的全部聊天信息 */
  async removeReadChatmsg(query: DateDto) {
    const { date } = query || {};
    const prevDate = new Date(date);
    const delRes = await this.chatRepository
      .createQueryBuilder('chat')
      .delete()
      .where('chat.create_time < :date AND chat.msg_status = :status', {
        date: prevDate,
        status: 'read',
      })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }
}
