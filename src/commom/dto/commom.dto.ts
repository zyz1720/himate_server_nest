import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsEmail } from 'class-validator';

// 分页查询参数
export class FindAllDto {
  //ApiProperty是对数据类型的描述
  @ApiPropertyOptional({ description: '页数', default: 1 })
  readonly pageNum?: number;

  @ApiPropertyOptional({ description: '条数', default: 10 })
  readonly pageSize?: number;
}

// 日期查询参数
export class DateDto {
  @ApiProperty({ description: '日期', required: true })
  @IsDateString()
  readonly date: string;
}

// 文件上传参数
export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsNotEmpty()
  readonly file: Express.Multer.File;
}

// ids查询参数
export class IdsDto {
  @ApiProperty({
    description: 'id列表',
    type: 'array',
    items: { type: 'number' },
    required: true,
  })
  readonly ids: number[];
}

// 邮箱号查询参数
export class AccountDto {
  @ApiProperty({ description: '邮箱号', required: true })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly account: string;
}

// socket响应参数
export class SocketResDto {
  send_uid: number;
  session_id?: string;
  MsgId?: number;
  isReSend?: boolean;
}
