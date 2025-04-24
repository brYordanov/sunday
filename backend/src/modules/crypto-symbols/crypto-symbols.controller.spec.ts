import { Test, TestingModule } from '@nestjs/testing';
import { CryptoSymbolsController } from './crypto-symbols.controller';

describe('CryptoSymbolsController', () => {
  let controller: CryptoSymbolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoSymbolsController],
    }).compile();

    controller = module.get<CryptoSymbolsController>(CryptoSymbolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
