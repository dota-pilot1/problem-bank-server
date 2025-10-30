import { Test, TestingModule } from '@nestjs/testing';
import { SharedTestResultsService } from './shared-test-results.service';

describe('SharedTestResultsService', () => {
  let service: SharedTestResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedTestResultsService],
    }).compile();

    service = module.get<SharedTestResultsService>(SharedTestResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
