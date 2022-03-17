import { Test, TestingModule } from '@nestjs/testing';
import { ReceivingService } from './receiving.service';

describe('ReceivingService', () => {
  let service: ReceivingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceivingService],
    }).compile();

    service = module.get<ReceivingService>(ReceivingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
