import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Crypto } from './crypto.entity';
import { HttpService } from '@nestjs/axios';
import { CacheService } from '../cache/cache.service';
import { CryptoSymbolsService } from '../crypto-symbols/crypto-symbols.service';
import { RegisterCounterService } from '../core/register-counter.service';
import { BadRequestException } from '@nestjs/common';

describe('CryptoService', () => {
  let service: CryptoService;

  const mockRepo = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCacheService = {
    getCachedData: jest.fn(),
    setCachedData: jest.fn(),
  };

  const mockHttpService = {
    axiosRef: {
      get: jest.fn(),
    },
  };

  const mockSymbolService = {
    getSpecificSymbol: jest.fn(),
  };

  const mockCounterService = {
    getCounter: jest.fn(),
    incrementCounter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        { provide: getRepositoryToken(Crypto), useValue: mockRepo },
        { provide: CacheService, useValue: mockCacheService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: CryptoSymbolsService, useValue: mockSymbolService },
        { provide: RegisterCounterService, useValue: mockCounterService },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return existing crypto if found in db', async () => {
    const existing = { id: 1, symbol: 'BTC' };
    mockRepo.findOneBy.mockResolvedValue(existing);

    const result = await service.registerCrypto('BTC');

    expect(result).toBe(existing);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ symbol: 'BTC' });
    expect(mockCacheService.getCachedData).not.toHaveBeenCalled();
    expect(mockHttpService.axiosRef.get).not.toHaveBeenCalled();
  });

  it('should return crypto from chache if not found in DB but found in cache', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);

    const fakeMonthlyData = {
      '2024-01-08': { OPEN: 10, CLOSE: 20, HIGH: 30, LOW: 5, VOLUME: 100, _timestamp: 12345 },
    };
    const fakeStringified = JSON.stringify(fakeMonthlyData);

    mockCacheService.getCachedData.mockResolvedValue(fakeStringified);
    mockRepo.create.mockReturnValue({ symbol: 'BTC', id: 2 });
    mockRepo.save.mockReturnValue({ symbol: 'BTC', id: 2 });

    const result = await service.registerCrypto('BTC');

    expect(mockCacheService.getCachedData).toHaveBeenCalledWith('BTC');
    expect(mockHttpService.axiosRef.get).not.toHaveBeenCalled();
    expect(result).toEqual({ symbol: 'BTC', id: 2 });
  });

  it('should fetch data from API, convert, cache it, and save crypto if not in DB or cache', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    mockCacheService.getCachedData.mockResolvedValue(null);

    mockCounterService.getCounter.mockResolvedValue(0);
    mockCounterService.incrementCounter.mockResolvedValue(undefined);

    const rawApiData = {
      Data: [
        { TIMESTAMP: 1700000000, OPEN: 10, CLOSE: 12, HIGH: 15, LOW: 8, VOLUME: 100 },
        { TIMESTAMP: 1700008640, OPEN: 12, CLOSE: 13, HIGH: 16, LOW: 9, VOLUME: 50 },
      ],
    };
    mockHttpService.axiosRef.get.mockResolvedValue({ data: rawApiData });

    mockRepo.create.mockReturnValue({ id: 3, symbol: 'BTC' });
    mockRepo.save.mockResolvedValue({ id: 3, symbol: 'BTC' });

    const result = await service.registerCrypto('BTC');

    expect(mockCounterService.getCounter).toHaveBeenCalled();
    expect(mockHttpService.axiosRef.get).toHaveBeenCalled();
    expect(mockCacheService.setCachedData).toHaveBeenCalledWith('BTC', expect.any(String));
    expect(result).toEqual({ id: 3, symbol: 'BTC' });
  });

  it('should throw an error when API request limit is reached', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    mockCacheService.getCachedData.mockResolvedValue(null);

    mockCounterService.getCounter.mockResolvedValue(20);

    await expect(service.registerCrypto('BTC')).rejects.toThrow(BadRequestException);

    expect(mockCounterService.getCounter).toHaveBeenCalled();
    expect(mockHttpService.axiosRef.get).not.toHaveBeenCalled();
  });

  it('should return an error when API responce is empty', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    mockCacheService.getCachedData.mockResolvedValue(null);

    mockCounterService.getCounter.mockResolvedValue(0);

    const rawApiData = {
      Data: [],
    };

    mockHttpService.axiosRef.get.mockResolvedValue({ data: rawApiData });

    await expect(service.registerCrypto('BTC')).rejects.toThrow(BadRequestException);

    expect(mockCounterService.getCounter).toHaveBeenCalled();
    expect(mockHttpService.axiosRef.get).toHaveBeenCalled();
  });
});
