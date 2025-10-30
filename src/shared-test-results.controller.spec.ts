import { Test, TestingModule } from '@nestjs/testing';
import { SharedTestResultsController } from './shared-test-results.controller';

describe('SharedTestResultsController', () => {
  let controller: SharedTestResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedTestResultsController],
    }).compile();

    controller = module.get<SharedTestResultsController>(SharedTestResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
