import { Test, TestingModule } from '@nestjs/testing';
import { CryptoSymbolsService } from './crypto-symbols.service';

describe('CryptoSymbolsService', () => {
  let service: CryptoSymbolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoSymbolsService],
    }).compile();

    service = module.get<CryptoSymbolsService>(CryptoSymbolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
