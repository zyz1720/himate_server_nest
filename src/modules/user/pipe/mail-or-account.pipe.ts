import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserLoginBypasswordDto } from '../dto/user-login-password.dto';

@Injectable()
export class MailOrAccountValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const dto = plainToInstance(UserLoginBypasswordDto, value);
    const errors = await validate(dto);
    if (errors.length > 0) {
      // 这里可以抛出异常或返回一个错误对象
      throw new BadRequestException('验证失败');
    }
    // 验证通过，但至少有一个字段（email或phone）被提供
    if (!dto.account && !dto.self_account) {
      throw new BadRequestException('必须提供邮箱或账号');
    }
    return dto;
  }
}
