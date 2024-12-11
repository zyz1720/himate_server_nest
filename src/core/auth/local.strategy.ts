// 本地策略
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    // console.log('本地验证初始化！');
    super({
      usernameField: 'account',
      passwordField: 'password',
    });
  }

  // 这个方法会从你的 请求参数中 拿到用户名和密码，一定要传递请求参数！！！！
  async validate(account: string, password: string): Promise<any> {
    console.log('开始本地验证！', account, password);
    const user = await this.userService.findOneUser({ account, password });
    if (!user) {
      throw new UnauthorizedException('未授权的请求'); // 未授权的请求
    }
    console.log('验证完成！', user);
    // 最终结果是在 在请求对象上创建user 属性 等价于res.user = user
    return user;
  }
}
