import { Test, TestingModule } from '@nestjs/testing';
import { TestSetsService } from './test-sets.service';

describe('TestSetsService', () => {
  let service: TestSetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestSetsService],
    }).compile();

    service = module.get<TestSetsService>(TestSetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
