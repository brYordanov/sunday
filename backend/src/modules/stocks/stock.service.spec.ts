import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { GetStockQueryParamsDto } from '@sunday/validations';

import { StocksService } from './stocks.service';
import { Stock } from './stock.entity';
import { createMockCacheService } from '../../test-utils/cache/factories';
import { createMockSymbolService } from '../../test-utils/stock-symbols/factories';
import { createMockCounterService } from '../../test-utils/counter/factories';
import {
  mockStockData,
  mockStockSchemaStringified,
  mockSymbolSchema,
} from '../../test-utils/stocks/mock-stock-data';
import {
  createMockHttpService,
  createMockQueryBuilder,
  createMockRepo,
} from '../../test-utils/stocks/factories';
import { mockCacheStockData } from '../../test-utils/cache/mock-cache-data';
import { CacheService } from '../cache/cache.service';
import { StockSymbolsService } from '../stock-symbols/stock-symbols.service';
import { RegisterCounterService } from '../core/register-counter.service';

describe('StocksService', () => {
  let service: StocksService;
  let repo: ReturnType<typeof createMockRepo>;
  let http: ReturnType<typeof createMockHttpService>;
  let cache: ReturnType<typeof createMockCacheService>;
  let symbols: ReturnType<typeof createMockSymbolService>;
  let counter: ReturnType<typeof createMockCounterService>;
  let qb: ReturnType<typeof createMockQueryBuilder>;

  beforeEach(async () => {
    repo = createMockRepo();
    http = createMockHttpService();
    cache = createMockCacheService();
    symbols = createMockSymbolService();
    counter = createMockCounterService();
    qb = createMockQueryBuilder();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        { provide: getRepositoryToken(Stock), useValue: { ...repo, createQueryBuilder: () => qb } },
        { provide: HttpService, useValue: http },
        { provide: CacheService, useValue: cache },
        { provide: StockSymbolsService, useValue: symbols },
        { provide: RegisterCounterService, useValue: counter },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock-api-key') },
        },
      ],
    }).compile();

    service = module.get(StocksService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('processStock', () => {
    it('should return existing record from DB', async () => {
      repo.findOneBy.mockResolvedValue(mockStockData);

      const result = await service.processStock('AAPL');

      expect(result).toBe(mockStockData);
      expect(repo.findOneBy).toHaveBeenCalledWith({ symbol: 'AAPL' });
    });

    it('should return parsed record from cache', async () => {
      repo.findOneBy.mockResolvedValue(null);
      cache.getCachedData.mockResolvedValue(JSON.stringify(mockCacheStockData));

      repo.create.mockReturnValue(mockStockData);
      repo.save.mockResolvedValue(mockStockData);

      const result = await service.processStock('AAPL');

      expect(result).toEqual(mockStockData);
      expect(cache.getCachedData).toHaveBeenCalledWith('AAPL');
    });

    it('should fetch from API, cache, and save if not in DB or cache', async () => {
      repo.findOneBy.mockResolvedValue(null);
      cache.getCachedData.mockResolvedValue(null);

      counter.getCounter.mockResolvedValue(0);
      counter.incrementCounter.mockResolvedValue(undefined);
      http.axiosRef.get.mockResolvedValue({ data: mockCacheStockData });

      repo.create.mockReturnValue(mockStockData);
      repo.save.mockResolvedValue(mockStockData);

      const result = await service.processStock('AAPL');

      expect(result).toEqual(mockStockData);
      expect(http.axiosRef.get).toHaveBeenCalled();
      expect(cache.setCachedData).toHaveBeenCalledWith('AAPL', expect.any(String));
    });

    it('should throw if daily API limit reached', async () => {
      repo.findOneBy.mockResolvedValue(null);
      cache.getCachedData.mockResolvedValue(null);
      counter.getCounter.mockResolvedValue(20);

      await expect(service.processStock('AAPL')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getDataFromExternalApi', () => {
    it('should throw when API limit is exceeded', async () => {
      counter.getCounter.mockResolvedValue(20);

      await expect(service.getDataFromExternalApi('AAPL')).rejects.toThrow(BadRequestException);
      expect(http.axiosRef.get).not.toHaveBeenCalled();
    });

    it('should fetch data from external API', async () => {
      counter.getCounter.mockResolvedValue(0);
      http.axiosRef.get.mockResolvedValue({ data: mockCacheStockData });

      const result = await service.getDataFromExternalApi('AAPL');

      expect(result).toEqual(mockCacheStockData);
      expect(http.axiosRef.get).toHaveBeenCalled();
    });
  });

  describe('getStock', () => {
    it('should apply symbol + date filters and order', async () => {
      qb.getMany.mockResolvedValue([mockStockData]);

      const params: GetStockQueryParamsDto = {
        symbol: 'aapl',
        createdAfter: '2023-01-01',
        createdBefore: '2024-01-01',
        order: 'DESC',
      };

      const result = await service.getStock(params);

      expect(qb.andWhere).toHaveBeenCalledWith('stock.createdAt > :createdAfter', {
        createdAfter: new Date('2023-01-01').toISOString(),
      });
      expect(qb.andWhere).toHaveBeenCalledWith('stock.createdAt < :createdBefore', {
        createdBefore: new Date('2024-01-01').toISOString(),
      });
      expect(qb.orderBy).toHaveBeenCalledWith('stock.createdAt', 'DESC');
      expect(result).toEqual([mockStockData]);
    });

    it('should skip empty or undefined params', async () => {
      qb.getMany.mockResolvedValue([]);

      const result = await service.getStock({ symbol: '', order: undefined });

      expect(qb.andWhere).not.toHaveBeenCalled();
      expect(qb.orderBy).not.toHaveBeenCalled();
    });
  });

  describe('getDetailedInfo', () => {
    it('should return parsed data from all sources', async () => {
      repo.findOne.mockResolvedValue(mockStockData);
      symbols.getSpecificSymbol.mockResolvedValue(mockSymbolSchema);
      cache.getCachedData.mockResolvedValue(mockStockSchemaStringified);

      const result = await service.getDetailedInfo({ symbol: 'AAPL' });

      expect(result).toHaveProperty('analysedData');
      expect(result).toHaveProperty('stockSymbolData');
      expect(result).toHaveProperty('cachedData');
      expect(result.analysedData.symbol).toBe('AAPL');
    });
  });
});
