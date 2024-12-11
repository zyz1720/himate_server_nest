import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { mateEntity } from 'src/entities/mate.entity';
import { CreateMateDto } from './dto/create-mate.dto';
import { UpdateMateDto } from './dto/update-mate.dto';
import { FindAllMateDto } from './dto/findall-mate.dto';
import { Msg } from 'src/commom/constants/base-msg.const';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from '../user/user.service';
import { ResultList, ResultMsg } from 'src/commom/utils/result';
import { FindMateStatusDto } from './dto/findstatus-mate.dto';
import { createUUID } from 'src/commom/utils/base';
import { FindMateBymIdDto } from './dto/findbymId-mate.dto';

@Injectable()
export class MateService {
  constructor(
    @InjectRepository(mateEntity)
    private readonly mateRepository: Repository<mateEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
  ) {}

  // 查询两个用户的好友关系
  async findUserMateStatus(query: FindMateStatusDto) {
    const { selfUid, otherUid, mate_status } = query || {};
    // 查询是否为好友
    const qb = this.mateRepository.createQueryBuilder('mate');

    qb.where(
      new Brackets((qb) => {
        qb.where('mate.apply_uid = :selfUid AND mate.agree_uid = :otherUid', {
          selfUid,
          otherUid,
        }).orWhere('mate.apply_uid = :otherUid AND mate.agree_uid = :selfUid', {
          selfUid,
          otherUid,
        });
      }),
    );
    if (mate_status) {
      qb.andWhere('mate.mate_status = :status', { status: mate_status });
    }
    const mateRes = await qb.getOne();

    if (mateRes) {
      if (selfUid == mateRes.apply_uid) {
        return {
          remark: mateRes.agree_remark,
          ...mateRes,
        };
      }
      if (selfUid == mateRes.agree_uid) {
        return {
          remark: mateRes.apply_remark,
          ...mateRes,
        };
      }
    } else {
      return null;
    }
  }

  // 请求添加好友
  async addMate(data: CreateMateDto) {
    const { apply_uid, agree_uid, agree_remark } = data || {};
    const applyUser = await this.userService.findOneUser({ id: apply_uid });
    const agreeUser = await this.userService.findOneUser({ id: agree_uid });
    if (!applyUser) {
      return ResultMsg.fail('用户不存在');
    }
    if (!agreeUser) {
      return ResultMsg.fail('要添加的用户不存在');
    }
    const mate_id = createUUID();
    const mateData = {
      mate_id,
      apply_avatar: applyUser.user_avatar,
      apply_remark: applyUser.user_name,
      agree_avatar: agreeUser.user_avatar,
      agree_remark: agree_remark ? agree_remark : agreeUser.user_name,
      ...data,
    };
    const newMate = this.mateRepository.create(mateData);
    const insertRes = await this.mateRepository.insert(newMate);
    if (insertRes) {
      return ResultMsg.ok('发送好友请求成功！');
    } else {
      return ResultMsg.fail('发送好友请求失败');
    }
  }

  /* 用户好友列表 */
  async findUserMate(query: FindAllMateDto) {
    const { pageNum = 1, pageSize = 10, uid, mate_status } = query || {};
    const qb = this.mateRepository.createQueryBuilder('mate');
    qb.where(
      new Brackets((qb) => {
        qb.where('mate.agree_uid = :userId', { userId: uid }).orWhere(
          'mate.apply_uid = :userId',
          { userId: uid },
        );
      }),
    ).andWhere('mate.mate_status = :status', { status: mate_status });
    qb.cache(true);
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
    qb.orderBy('mate.create_time');

    const count = await qb.getCount();
    const data = await qb.getMany();

    let newdata = [];
    if (data.length) {
      newdata = data.map((item) => {
        if (uid == item.apply_uid) {
          return {
            id: item.id,
            uid: item.agree_uid,
            remark: item.agree_remark,
            avatar: item.agree_avatar,
            ...item,
          };
        }
        if (uid == item.agree_uid) {
          return {
            id: item.id,
            uid: item.apply_uid,
            remark: item.apply_remark,
            avatar: item.apply_avatar,
            ...item,
          };
        }
      });
    }
    return ResultList.list(newdata, count);
  }

  /*  加我的列表 */
  async findAllApplyUser(query: FindAllMateDto) {
    const { pageNum = 1, pageSize = 10, uid } = query || {};
    const qb = this.mateRepository.createQueryBuilder('mate');
    qb.where('mate.mate_status = :status', { status: 'waiting' });
    qb.andWhere('mate.agree_uid = :userId', { userId: uid });
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
    qb.orderBy('mate.create_time');
    const count = await qb.getCount();
    const data = await qb.getMany();
    return ResultList.list(data, count);
  }

  /* 好友信息详情id */
  async findOneMateById(id: number) {
    const mateRes = await this.mateRepository.findOne({
      where: { id },
    });
    return mateRes;
  }

  /* 好友信息详情mate_id */
  async findOneMateBymateId(query: FindMateBymIdDto) {
    const { mate_id, mate_status, uid } = query || {};
    const qb = this.mateRepository.createQueryBuilder('mate');
    qb.where({ mate_id });
    if (mate_status) {
      qb.andWhere('mate.mate_status = :status', { status: mate_status });
    }
    const mateRes = await qb.getOne();
    if (uid && mateRes) {
      return {
        other_uid:
          mateRes.apply_uid == uid ? mateRes.agree_uid : mateRes.apply_uid,
        other_remark:
          mateRes.apply_uid == uid
            ? mateRes.agree_remark
            : mateRes.apply_remark,
        other_avatar:
          mateRes.apply_uid == uid
            ? mateRes.agree_avatar
            : mateRes.apply_avatar,
        ...mateRes,
      };
    }
    return mateRes;
  }

  /* 修改好友信息 */
  async updateMate(data: UpdateMateDto) {
    const { id, uid, remark } = data || {};
    const mateRes = await this.findOneMateById(id);
    if (mateRes) {
      if (mateRes.agree_uid == uid) {
        mateRes.apply_remark = remark;
      }
      if (mateRes.apply_uid == uid) {
        mateRes.agree_remark = remark;
      }
      const updatePost = this.mateRepository.merge(mateRes, data);
      const saveRes = await this.mateRepository.save(updatePost);
      if (saveRes) {
        return ResultMsg.ok(Msg.UPDATE_SUCCESS, saveRes);
      } else {
        return ResultMsg.fail(Msg.UPDATE_FAIL);
      }
    } else {
      return ResultMsg.fail(Msg.DATA_NOEXIST);
    }
  }

  /* 删除好友 */
  async delMate(id: number) {
    const delRes = await this.mateRepository
      .createQueryBuilder('mate')
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
