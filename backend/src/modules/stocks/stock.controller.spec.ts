import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { Stock } from './stock.entity';

import {
  GetStockQueryParamsDto,
  StockSymbolPropertyDto,
  DetailedStockInfoDto,
} from '@sunday/validations';

import {
  mockStockDto,
  mockStockSchemaStringified,
  mockSymbolSchema,
} from '../../test-utils/stocks/mock-stock-data';

describe('StocksController', () => {
  let controller: StocksController;
  let service: jest.Mocked<StocksService>;

  const mockDetailedInfo: DetailedStockInfoDto = {
    analysedData: mockStockDto,
    stockSymbolData: mockSymbolSchema,
    cachedData: JSON.parse(mockStockSchemaStringified),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [
        {
          provide: StocksService,
          useValue: {
            getStock: jest.fn().mockResolvedValue([mockStockDto]),
            getDetailedInfo: jest.fn().mockResolvedValue(mockDetailedInfo),
            processStock: jest.fn().mockResolvedValue(mockStockDto),
          },
        },
      ],
    }).compile();

    controller = module.get(StocksController);
    service = module.get(StocksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /stocks', () => {
    it('should return a list of stocks', async () => {
      const query: GetStockQueryParamsDto = {
        symbol: 'aapl',
        createdAfter: '2020-01-01',
        createdBefore: '2024-01-01',
        order: 'ASC',
      };

      const result = await controller.getStock(query);

      expect(service.getStock).toHaveBeenCalledWith(query);
      expect(result).toEqual([mockStockDto]);
    });
  });

  describe('GET /stocks/detailed', () => {
    it('should return detailed stock info', async () => {
      const query: StockSymbolPropertyDto = { symbol: 'AAPL' };

      const result = await controller.getDetailedStockInfo(query);

      expect(service.getDetailedInfo).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockDetailedInfo);
    });
  });

  describe('POST /stocks', () => {
    it('should process and return the stock entity', async () => {
      const body: StockSymbolPropertyDto = { symbol: 'AAPL' };

      const result = await controller.registerStock(body);

      expect(service.processStock).toHaveBeenCalledWith('AAPL');
      expect(result).toEqual(mockStockDto);
    });
  });
});
