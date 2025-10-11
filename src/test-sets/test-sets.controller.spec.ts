import { Test, TestingModule } from '@nestjs/testing';
import { TestSetsController } from './test-sets.controller';

describe('TestSetsController', () => {
  let controller: TestSetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestSetsController],
    }).compile();

    controller = module.get<TestSetsController>(TestSetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
