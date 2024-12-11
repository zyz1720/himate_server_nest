/*
 * @Author: zyz 1720@qq.com
 * @Date: 2024-04-17 20:54:50
 * @LastEditors: zyz 1720@qq.com
 * @LastEditTime: 2024-04-17 21:23:46
 * @FilePath: \myself_-sever\src\modules\user\user.service.spec.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
