import { ApiExtraModels, getSchemaPath, ApiOkResponse } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import { Response, PageResponse } from './api-response';

/**
 * 自定义响应装饰器
 * 用于统一设置API响应类型，支持泛型
 * @param type 响应数据的类型
 * @param statusCode HTTP状态码
 * @param description 响应描述
 */
export function ApiOkRes<TModel extends Type<any>>(
  model: TModel,
  description = '操作成功',
) {
  return applyDecorators(
    ApiExtraModels(Response, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(Response) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
}

/**
 * 自定义消息响应装饰器
 * 用于统一设置API响应类型，支持泛型
 * @param type 响应数据的类型
 * @param statusCode HTTP状态码
 * @param description 响应描述
 */
export function ApiOkMsgRes(description = '操作成功') {
  return applyDecorators(
    ApiExtraModels(Response),
    ApiOkResponse({
      description,
      schema: {
        allOf: [{ $ref: getSchemaPath(Response) }],
      },
    }),
  );
}

/**
 * 自定义分页响应装饰器
 * 用于统一设置分页API响应类型，支持泛型
 * @param type 列表项的类型
 * @param statusCode HTTP状态码
 * @param description 响应描述
 */
export function ApiOkPageRes<TModel extends Type<any>>(
  model: TModel,
  description = '操作成功',
) {
  return applyDecorators(
    ApiExtraModels(PageResponse, Response, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(Response) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PageResponse) },
                  {
                    properties: {
                      list: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
}
