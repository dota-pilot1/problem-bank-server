import { Test, TestingModule } from '@nestjs/testing';
import { ChatScriptsService } from './chat-scripts.service';

describe('ChatScriptsService', () => {
  let service: ChatScriptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatScriptsService],
    }).compile();

    service = module.get<ChatScriptsService>(ChatScriptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
