import { ApiProperty } from '@nestjs/swagger';
interface IResMsg {
  send_uid: number;
  session_id?: string;
  MsgId?: number;
  isReSend?: boolean;
}
/**
 * 消息响应结构
 * ok 成功
 * fail 失败
 */
export class ResultMsg {
  constructor(msg?: string, data?: any, success?: boolean) {
    this.data = data || null;
    this.message = msg || '操作成功';
    this.success = success;
    this.code = success ? 200 : 1001;
  }

  @ApiProperty({ type: 'number', description: '状态码', default: 1001 })
  code: number;

  @ApiProperty({ description: '返回数据', default: null })
  data: any;

  @ApiProperty({
    type: 'string',
    description: '消息提示',
    default: '操作成功',
  })
  message: string;

  @ApiProperty({ type: 'boolean', default: true })
  success: boolean;

  static ok(msg?: string, data?: any): ResultMsg {
    return new ResultMsg(msg, data, true);
  }

  static fail(msg: string = '操作失败'): ResultMsg {
    return new ResultMsg(msg, null, false);
  }

  static socket(msg?: string, data?: IResMsg, success?: boolean): ResultMsg {
    return new ResultMsg(msg, data, success);
  }
}

/**
 * 列表响应结构
 */
export class ResultList<T> {
  constructor(list: T[], count: number) {
    this.list = list || [];
    this.count = count || 0;
  }

  @ApiProperty({ type: 'Array', default: [] })
  list?: T[];

  @ApiProperty({ type: 'boolean', default: 0 })
  count: number;

  static list<T>(list?: T[], count?: number): ResultList<T> {
    return new ResultList(list, count);
  }
}
