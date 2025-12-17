import { ApiProperty } from '@nestjs/swagger';

/**
 * 数据消息响应结构类
 * 用于统一 API 响应格式
 */
export class Response<T> {
  /**
   * 构造函数
   * @param msg 响应消息
   * @param data 响应数据
   */
  constructor(msg: string, data: T, success: boolean) {
    this.data = data || null;
    this.message = msg || (success ? 'success' : 'failed!');
    this.code = success ? 0 : -1;
  }

  /**
   * 状态码，0 表示成功，-1 表示失败
   */
  @ApiProperty({
    type: Number,
    description: '状态码，0表示成功，-1表示失败',
    example: 0,
  })
  code: number;

  /**
   * 返回的数据对象
   */
  @ApiProperty({
    type: Object,
    description: '返回的数据',
  })
  data: T;

  /**
   * 操作结果的消息提示
   */
  @ApiProperty({
    type: String,
    description: '操作结果的消息提示',
    example: 'success',
  })
  message: string;

  /**
   * 创建成功响应
   * @param msg 成功消息
   * @param data 响应数据
   * @returns Response<T> 成功响应对象
   */
  static ok<T>(msg: string = 'success', data?: T): Response<T> {
    return new Response(msg, data, true);
  }

  /**
   * 创建失败响应
   * @param msg 失败消息
   * @param data 响应数据
   * @returns Response<T> 失败响应对象
   */
  static fail<T>(msg: string = 'failed!', data?: T): Response<T> {
    return new Response(msg, data, false);
  }
}

/**
 * 列表响应结构类
 * 用于统一分页列表数据的响应格式
 */
export class PageResponse<T> {
  /**
   * 构造函数
   * @param list 数据列表
   * @param total 总条数
   */
  constructor(list: T[], total: number) {
    this.list = list || [];
    this.total = total || 0;
  }

  /**
   * 数据列表
   */
  @ApiProperty({
    type: [Object],
    description: '数据列表',
  })
  list: T[];

  /**
   * 数据总条数
   */
  @ApiProperty({
    type: Number,
    description: '数据总条数',
  })
  total: number;

  /**
   * 创建列表响应对象
   * @param list 数据列表
   * @param total 总条数
   * @returns PageResponse<T> 列表响应对象
   */
  static list<T>(list: T[], total: number): PageResponse<T> {
    return new PageResponse(list, total);
  }
}
