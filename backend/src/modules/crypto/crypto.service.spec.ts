import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Crypto } from './crypto.entity';
import { HttpService } from '@nestjs/axios';
import { CacheService } from '../cache/cache.service';
import { CryptoSymbolsService } from '../crypto-symbols/crypto-symbols.service';
import { RegisterCounterService } from '../core/register-counter.service';
import { BadRequestException } from '@nestjs/common';
import {
  mockAnalysedData,
  mockCachedData,
  mockCryptoData,
  mockSymbolData,
} from '../../test-utils/crypto/mock-crypto-data';
import { GetStockQueryParamsDto } from '@sunday/validations';
import {
  createMockHttpService,
  createMockQueryBuilder,
  createMockRepo,
} from '../../test-utils/crypto/factories';
import { createMockCacheService } from '../../test-utils/cache/factories';
import { createMockSymbolService } from '../../test-utils/crypto-symbol/factories';
import { createMockCounterService } from '../../test-utils/counter/factories';
import { createTestCryptoService } from '../../test-utils/crypto/helpers';

describe('CryptoService', () => {
  let service: CryptoService;
  let repo: ReturnType<typeof createMockRepo>;
  let http: ReturnType<typeof createMockHttpService>;
  let cacheService: ReturnType<typeof createMockCacheService>;
  let symbolService: ReturnType<typeof createMockSymbolService>;
  let counterService: ReturnType<typeof createMockCounterService>;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    mockQueryBuilder = createMockQueryBuilder();
    const customRepo = {
      ...createMockRepo(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    const res = await createTestCryptoService({
      providers: [{ provide: getRepositoryToken(Crypto), useValue: customRepo }],
    });
    service = res.service;
    ({ repo, http, cacheService, symbolService, counterService } = res.mocks);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerCrypto', () => {
    it('should return existing crypto if found in db', async () => {
      const existing = mockCryptoData;
      repo.findOneBy.mockResolvedValue(existing);

      const result = await service.registerCrypto('BTC');

      expect(result).toBe(existing);
      expect(repo.findOneBy).toHaveBeenCalledWith({ symbol: 'BTC' });
      expect(cacheService.getCachedData).not.toHaveBeenCalled();
      expect(http.axiosRef.get).not.toHaveBeenCalled();
    });

    it('should return crypto from chache if not found in DB but found in cache', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const fakeMonthlyData = {
        '2024-01-08': { OPEN: 10, CLOSE: 20, HIGH: 30, LOW: 5, VOLUME: 100, _timestamp: 12345 },
      };
      const fakeStringified = JSON.stringify(fakeMonthlyData);

      cacheService.getCachedData.mockResolvedValue(fakeStringified);
      repo.create.mockReturnValue({ symbol: 'BTC', id: 2 });
      repo.save.mockResolvedValue({ symbol: 'BTC', id: 2 });

      const result = await service.registerCrypto('BTC');

      expect(cacheService.getCachedData).toHaveBeenCalledWith('BTC');
      expect(http.axiosRef.get).not.toHaveBeenCalled();
      expect(result).toEqual({ symbol: 'BTC', id: 2 });
    });

    it('should fetch data from API, convert, cache it, and save crypto if not in DB or cache', async () => {
      repo.findOneBy.mockResolvedValue(null);
      cacheService.getCachedData.mockResolvedValue(null);

      counterService.getCounter.mockResolvedValue(0);
      counterService.incrementCounter.mockResolvedValue(undefined);

      const rawApiData = {
        Data: [
          { TIMESTAMP: 1700000000, OPEN: 10, CLOSE: 12, HIGH: 15, LOW: 8, VOLUME: 100 },
          { TIMESTAMP: 1700008640, OPEN: 12, CLOSE: 13, HIGH: 16, LOW: 9, VOLUME: 50 },
        ],
      };
      http.axiosRef.get.mockResolvedValue({ data: rawApiData });

      repo.create.mockResolvedValue({ id: 3, symbol: 'BTC' });
      repo.save.mockResolvedValue({ id: 3, symbol: 'BTC' });

      const result = await service.registerCrypto('BTC');

      expect(counterService.getCounter).toHaveBeenCalled();
      expect(http.axiosRef.get).toHaveBeenCalled();
      expect(cacheService.setCachedData).toHaveBeenCalledWith('BTC', expect.any(String));
      expect(result).toEqual({ id: 3, symbol: 'BTC' });
    });

    it('should throw an error when API request limit is reached', async () => {
      repo.findOneBy.mockResolvedValue(null);
      cacheService.getCachedData.mockResolvedValue(null);

      counterService.getCounter.mockResolvedValue(20);

      await expect(service.registerCrypto('BTC')).rejects.toThrow(BadRequestException);

      expect(counterService.getCounter).toHaveBeenCalled();
      expect(http.axiosRef.get).not.toHaveBeenCalled();
    });

    it('should return an error when API responce is empty', async () => {
      repo.findOneBy.mockResolvedValue(null);
      cacheService.getCachedData.mockResolvedValue(null);

      counterService.getCounter.mockResolvedValue(0);

      const rawApiData = {
        Data: [],
      };

      http.axiosRef.get.mockResolvedValue({ data: rawApiData });

      await expect(service.registerCrypto('BTC')).rejects.toThrow(BadRequestException);

      expect(counterService.getCounter).toHaveBeenCalled();
      expect(http.axiosRef.get).toHaveBeenCalled();
    });
  });

  describe('getDetailedInfo', () => {
    it('should return detailed crypto info from DB, symbol service, and cache', async () => {
      const symbol = 'BTC';
      const params = { symbol };

      repo.findOne.mockResolvedValue(mockAnalysedData);
      symbolService.getSpecificSymbol.mockResolvedValue(mockSymbolData);
      cacheService.getCachedData.mockResolvedValue(mockCachedData);

      const result = await service.getDetailedInfo(params);

      expect(result).toEqual({
        analysedData: expect.any(Object),
        cryptoSymbolData: expect.any(Object),
        cachedData: JSON.parse(mockCachedData),
      });

      expect(result.analysedData.symbol).toBe('BTC');
      expect(result.cryptoSymbolData.name).toBe('Bitcoin');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { symbol } });
      expect(symbolService.getSpecificSymbol).toHaveBeenCalledWith(symbol);
      expect(cacheService.getCachedData).toHaveBeenCalledWith(symbol);
    });
  });

  describe('getCrypto', () => {
    it('should return all matching crypto records with string filter and ordering', async () => {
      const params: GetStockQueryParamsDto = { symbol: 'btc', order: 'DESC' };
      const expected = [mockCryptoData];
      mockQueryBuilder.getMany.mockResolvedValue(expected);

      const result = await service.getCrypto(params);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('LOWER(crypto.symbol) LIKE :symbol', {
        symbol: '%btc%',
      });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('crypto.createdAt', 'DESC');
      expect(result).toEqual(expected);
    });

    it('should filter by createdAfter and createdBefore', async () => {
      const params = {
        createdAfter: '2023-01-01',
        createdBefore: '2024-01-01',
      };
      const expected = [{ id: 2, symbol: 'ETH' }];
      mockQueryBuilder.getMany.mockResolvedValue(expected);

      const result = await service.getCrypto(params);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('crypto.createdAt > :createdAfter', {
        createdAfter: new Date('2023-01-01').toISOString(),
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('crypto.createdAt < :createdBefore', {
        createdBefore: new Date('2024-01-01').toISOString(),
      });
      expect(result).toEqual(expected);
    });

    it('should filter by exact numeric field if present', async () => {
      const params = { id: 5 };
      const expected = [{ id: 5, symbol: 'XRP' }];
      mockQueryBuilder.getMany.mockResolvedValue(expected);

      const result = await service.getCrypto(params);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('crypto.id = :id', { id: 5 });
      expect(result).toEqual(expected);
    });

    it('should skip undefined, null, or empty string params', async () => {
      const params = { symbol: '', order: null, id: undefined };
      const expected = [];
      mockQueryBuilder.getMany.mockResolvedValue(expected);

      const result = await service.getCrypto(params);

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).not.toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });
});
