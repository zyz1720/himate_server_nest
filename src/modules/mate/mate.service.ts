import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { mateEntity } from 'src/entities/mate.entity';
import { CreateMateDto } from './dto/create-mate.dto';
import { UpdateMateDto } from './dto/update-mate.dto';
import { FindAllMateDto, FindAllMatelistDto } from './dto/findall-mate.dto';
import { Msg } from 'src/commom/constants/base-msg.const';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from '../user/user.service';
import { ResultList, ResultMsg } from 'src/commom/utils/result';
import { FindMateStatusDto } from './dto/findstatus-mate.dto';
import { FindMateBymIdDto } from './dto/findbymId-mate.dto';
import { UpdateAllMateDto } from './dto/updateall-mate.dto';
import { IdsDto } from 'src/commom/dto/commom.dto';
import {
  MateStatus,
  NumericStatus,
} from 'src/commom/constants/base-enum.const';

@Injectable()
export class MateService {
  constructor(
    @InjectRepository(mateEntity)
    private readonly mateRepository: Repository<mateEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
  ) {}

  // 查询两个用户的好友关系
  async findUserMateStatus(query: FindMateStatusDto, _uid?: number) {
    const { selfUid, otherUid, mate_status } = query || {};
    if (selfUid == otherUid) {
      return ResultMsg.fail('不能添加自己为好友');
    }
    if (_uid && (selfUid != _uid || otherUid != _uid)) {
      return ResultMsg.fail(Msg.NO_PERMISSION);
    }
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
    const mateRes = await this.findUserMateStatus({
      selfUid: apply_uid,
      otherUid: agree_uid,
    });
    if (mateRes) {
      return ResultMsg.fail('已经是好友了');
    }
    const applyUser = await this.userService.findOneUser({ id: apply_uid });
    if (!applyUser) {
      return ResultMsg.fail('用户不存在');
    }
    const agreeUser = await this.userService.findOneUser({ id: agree_uid });
    if (!agreeUser) {
      return ResultMsg.fail('要添加的用户不存在');
    }

    const mateData = {
      apply_avatar: applyUser.user_avatar,
      apply_remark: applyUser.user_name,
      agree_avatar: agreeUser.user_avatar,
      agree_remark: agree_remark ?? agreeUser.user_name,
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
  async findUserMate(query: FindAllMateDto, _uid?: number) {
    const {
      pageNum = 0,
      pageSize = 10,
      uid,
      mate_status,
      isPaging,
    } = query || {};
    if (_uid && uid != _uid) {
      return ResultMsg.fail(Msg.NO_PERMISSION);
    }
    const qb = this.mateRepository.createQueryBuilder('mate');
    qb.where(
      new Brackets((qb) => {
        qb.where('mate.agree_uid = :userId', { userId: uid }).orWhere(
          'mate.apply_uid = :userId',
          { userId: uid },
        );
      }),
    ).andWhere('mate.mate_status = :status', { status: mate_status });
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * pageNum);
    }
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
  async findAllApplyUser(query: FindAllMateDto, _uid?: number) {
    const { pageNum = 0, pageSize = 10, uid, isPaging } = query || {};
    if (_uid && uid != _uid) {
      return ResultMsg.fail(Msg.NO_PERMISSION);
    }
    const qb = this.mateRepository.createQueryBuilder('mate');
    qb.where('mate.mate_status = :status', { status: MateStatus.Waiting });
    qb.andWhere('mate.agree_uid = :userId', { userId: uid });
    if (isPaging) {
      qb.limit(pageSize);
      qb.offset(pageSize * pageNum);
    }
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
  async findOneMateBymateId(query: FindMateBymIdDto, _uid?: number) {
    const { mate_id, mate_status, uid } = query || {};
    if (_uid && uid != _uid) {
      return ResultMsg.fail(Msg.NO_PERMISSION);
    }
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
  async updateMate(data: UpdateMateDto, _uid?: number) {
    const { id, uid, remark } = data || {};
    const mateRes = await this.findOneMateById(id);
    if (mateRes) {
      if (_uid && (mateRes.agree_uid != _uid || mateRes.apply_uid != _uid)) {
        return ResultMsg.fail(Msg.NO_PERMISSION);
      }
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

  /* 软删除好友 */
  async delMate(id: number, uid?: number) {
    const qb = this.mateRepository.createQueryBuilder('mate').softDelete();
    qb.where('id = :id', { id });
    if (uid) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('mate.apply_uid = :userId', { userId: uid }).orWhere(
            'mate.agree_uid = :userId',
            { userId: uid },
          );
        }),
      );
    }
    const delRes = await qb.execute();
    if (delRes.affected) {
      return ResultMsg.ok(Msg.DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  async findAllMateList(query: FindAllMatelistDto) {
    const {
      pageNum = 0,
      pageSize = 10,
      isPaging = NumericStatus.True,
      agree_uid,
      agree_remark,
      apply_uid,
      apply_remark,
      validate_msg,
      mate_status,
      id,
      ids,
      mate_id,
    } = query || {};
    const qb = this.mateRepository.createQueryBuilder('mate');
    if (id) {
      qb.andWhere('id = :id', { id });
    }
    if (mate_id) {
      qb.andWhere('mate_id = :mate_id', { mate_id });
    }
    if (ids) {
      qb.andWhere('id IN (:...ids)', { ids });
    }
    if (agree_uid) {
      qb.andWhere('agree_uid = :a_uid', { a_uid: agree_uid });
    }
    if (agree_remark) {
      qb.andWhere('agree_remark = :a_remark', { a_remark: agree_remark });
    }
    if (apply_uid) {
      qb.andWhere('apply_uid = :a_uid', { a_uid: apply_uid });
    }
    if (apply_remark) {
      qb.andWhere('apply_remark = :a_remark', { a_remark: apply_remark });
    }
    if (validate_msg) {
      qb.andWhere('validate_msg LIKE :v_msg', { v_msg: `%${validate_msg}%` });
    }
    if (mate_status) {
      qb.andWhere('mate_status = :status', { status: mate_status });
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

  /*  修改群信息 */
  async updateMateAll(data: UpdateAllMateDto) {
    const { id } = data || {};
    const updateRes = await this.mateRepository
      .createQueryBuilder('mate')
      .update()
      .set({ ...data })
      .where('id = :id', { id })
      .execute();
    if (updateRes.affected) {
      return ResultMsg.ok(Msg.UPDATE_SUCCESS, updateRes.generatedMaps[0]);
    } else {
      return ResultMsg.fail(Msg.UPDATE_FAIL);
    }
  }

  /* 软删除好友关系 */
  async softDeleteMate(data: IdsDto) {
    const { ids } = data || {};
    const delRes = await this.mateRepository
      .createQueryBuilder('mate')
      .softDelete()
      .where('id IN (:...ids)', { ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_DELETE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.DELETE_FAIL);
    }
  }

  /* 恢复好友关系 */
  async restoreMate(data: IdsDto) {
    const { ids = [] } = data || {};
    const delRes = await this.mateRepository
      .createQueryBuilder('mate')
      .restore()
      .where('id IN (:...ids)', { ids })
      .execute();
    if (delRes.affected) {
      return ResultMsg.ok(delRes.affected + Msg.BATCH_RESTORE_SUCCESS);
    } else {
      return ResultMsg.fail(Msg.RESTORE_FAIL);
    }
  }

  /* 真刪除好友关系*/
  async realDeleteMate(data: IdsDto) {
    const { ids = [] } = data || {};
    const delRes = await this.mateRepository
      .createQueryBuilder('mate')
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
