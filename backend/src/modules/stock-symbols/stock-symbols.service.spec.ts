import { Test, TestingModule } from '@nestjs/testing';
import { StockSymbolsService } from './stock-symbols.service';

describe('StockSymbolsService', () => {
  let service: StockSymbolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockSymbolsService],
    }).compile();

    service = module.get<StockSymbolsService>(StockSymbolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
