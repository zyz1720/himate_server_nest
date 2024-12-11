import { Test, TestingModule } from '@nestjs/testing';
import { MateController } from './mate.controller';
import { MateService } from './mate.service';

describe('MateController', () => {
  let controller: MateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MateController],
      providers: [MateService],
    }).compile();

    controller = module.get<MateController>(MateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
