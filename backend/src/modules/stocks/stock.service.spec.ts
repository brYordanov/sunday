import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

import { Stock } from './stock.entity';
import { CacheService } from '../cache/cache.service';
import { StockSymbolsService } from '../stock-symbols/stock-symbols.service';
import { RegisterCounterService, CounterKeyEnum } from '../core/register-counter.service';

import { createMockRepo, createMockHttpService } from '../../test-utils/stocks/factories';
import { createMockCacheService } from '../../test-utils/cache/factories';
import { createMockSymbolService } from '../../test-utils/stock-symbols/factories';
import { createMockCounterService } from '../../test-utils/counter/factories';

import {
  mockStockData,
  mockStockSchema,
  mockSymbolSchema,
} from '../../test-utils/stocks/mock-stock-data';
import { StocksService } from './stocks.service';

describe('StocksService', () => {
  let service: StocksService;
  let repo: ReturnType<typeof createMockRepo>;
  let http: ReturnType<typeof createMockHttpService>;
  let cache: ReturnType<typeof createMockCacheService>;
  let symbol: ReturnType<typeof createMockSymbolService>;
  let counter: ReturnType<typeof createMockCounterService>;
  let config: ConfigService;

  beforeEach(async () => {
    repo = createMockRepo();
    http = createMockHttpService();
    cache = createMockCacheService();
    symbol = createMockSymbolService();
    counter = createMockCounterService();
    config = { get: jest.fn().mockReturnValue('test-api-key') } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        { provide: getRepositoryToken(Stock), useValue: repo },
        { provide: HttpService, useValue: http },
        { provide: CacheService, useValue: cache },
        { provide: StockSymbolsService, useValue: symbol },
        { provide: RegisterCounterService, useValue: counter },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get(StocksService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('processStock', () => {
    it('should return existing stock from DB', async () => {
      repo.findOneBy.mockResolvedValue(mockStockData);
      const result = await service.processStock('AAPL');
      expect(result).toBe(mockStockData);
    });

    it('should return cached stock if not in DB', async () => {
      repo.findOneBy.mockResolvedValue(null);
      cache.getCachedData.mockResolvedValue(JSON.stringify(mockStockData));
      repo.create.mockReturnValue(mockStockData);
      repo.save.mockResolvedValue(mockStockData);

      const result = await service.processStock('AAPL');
      expect(result).toEqual(mockStockData);
      expect(cache.getCachedData).toHaveBeenCalledWith('AAPL');
    });

    it('should fetch from API and save if not in DB or cache', async () => {
      repo.findOneBy.mockResolvedValue(null);
      cache.getCachedData.mockResolvedValue(null);
      counter.getCounter.mockResolvedValue(0);
      http.axiosRef.get.mockResolvedValue({ data: mockStockData });

      repo.create.mockReturnValue(mockStockData);
      repo.save.mockResolvedValue(mockStockData);

      const result = await service.processStock('AAPL');
      expect(result).toEqual(mockStockData);
      expect(http.axiosRef.get).toHaveBeenCalled();
      expect(cache.setCachedData).toHaveBeenCalledWith('AAPL', expect.any(String));
    });
  });

  describe('getDataFromExternalApi', () => {
    it('should throw if counter exceeds limit', async () => {
      counter.getCounter.mockResolvedValue(21);
      await expect(service.getDataFromExternalApi('AAPL')).rejects.toThrow(BadRequestException);
    });

    it('should fetch stock data from API', async () => {
      counter.getCounter.mockResolvedValue(0);
      const apiResponse = { data: mockStockData };
      http.axiosRef.get.mockResolvedValue(apiResponse);

      const result = await service.getDataFromExternalApi('AAPL');
      expect(result).toEqual(mockStockData);
      expect(http.axiosRef.get).toHaveBeenCalled();
    });
  });

  describe('getStock', () => {
    it('should apply filters and return stock list', async () => {
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockStockData]),
      };
      repo.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

      const result = await service.getStock({
        symbol: 'aapl',
        createdBefore: '2024-01-01',
        createdAfter: '2020-01-01',
        order: 'ASC',
      });

      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('stock.createdAt', 'ASC');
      expect(result).toEqual([mockStockData]);
    });
  });

  describe('getDetailedInfo', () => {
    it('should return parsed detailed stock info', async () => {
      repo.findOne.mockResolvedValue(mockStockData);
      symbol.getSpecificSymbol.mockResolvedValue(mockSymbolSchema);
      cache.getCachedData.mockResolvedValue(JSON.stringify(mockStockSchema));

      const result = await service.getDetailedInfo({ symbol: 'AAPL' });

      expect(result).toHaveProperty('analysedData');
      expect(result).toHaveProperty('stockSymbolData');
      expect(result).toHaveProperty('cachedData');
    });
  });
});
