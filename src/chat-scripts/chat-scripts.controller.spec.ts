import { Test, TestingModule } from '@nestjs/testing';
import { ChatScriptsController } from './chat-scripts.controller';

describe('ChatScriptsController', () => {
  let controller: ChatScriptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatScriptsController],
    }).compile();

    controller = module.get<ChatScriptsController>(ChatScriptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
