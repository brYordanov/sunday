import { Test, TestingModule } from '@nestjs/testing';
import { StockSymbolsController } from './stock-symbols.controller';

describe('StockSymbolsController', () => {
  let controller: StockSymbolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockSymbolsController],
    }).compile();

    controller = module.get<StockSymbolsController>(StockSymbolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
