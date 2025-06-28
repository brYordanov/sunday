import { Test, TestingModule } from '@nestjs/testing';
import { StockSymbolsController } from './stock-symbols.controller';
import { StockSymbolsService } from './stock-symbols.service';

import { StockSymbolPaginatedResponceDto, StockSymbolQueryParamsDto } from '@sunday/validations';
import { mockSymbolsPagiantedResponse } from '../../test-utils/stock-symbols/mock-stock-symbols-data';

describe('StockSymbolsController', () => {
  let controller: StockSymbolsController;
  let service: jest.Mocked<StockSymbolsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockSymbolsController],
      providers: [
        {
          provide: StockSymbolsService,
          useValue: {
            getSymbols: jest.fn().mockResolvedValue(mockSymbolsPagiantedResponse),
            populateTable: jest.fn().mockResolvedValue({ message: 'ok' }),
          },
        },
      ],
    }).compile();

    controller = module.get(StockSymbolsController);
    service = module.get(StockSymbolsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /stock-symbols', () => {
    it('should call service and return paginated results', async () => {
      const query: StockSymbolQueryParamsDto = {
        page: 1,
        limit: 10,
        order: 'ASC',
        query: '',
      };

      const result = await controller.getSymbols(query);

      expect(service.getSymbols).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockSymbolsPagiantedResponse);
    });
  });

  describe('POST /stock-symbols/populate', () => {
    it('should call service.populateTable() and return response', async () => {
      const result = await controller.registerAllStockSymbols();

      expect(service.populateTable).toHaveBeenCalled();
      expect(result).toEqual({ message: 'ok' });
    });
  });
});
