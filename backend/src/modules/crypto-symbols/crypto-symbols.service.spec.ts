import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { CryptoSymbolsService } from './crypto-symbols.service';
import { CryptoSymbol } from './crypto-symbols.entity';
import { PaginationService } from '../core/pagination.service';
import { BadRequestException } from '@nestjs/common';
import { CryptoSymbolQueryParamsDto } from '@sunday/validations';
import {
  mockCryptoSymbols,
  mockExternalApiSymbols,
} from '../../test-utils/crypto-symbol/mock-crypto-symbols-data';
import {
  createMockRepo,
  createMockHttpService,
  createMockPaginationService,
} from '../../test-utils/crypto-symbol/factories';

describe('CryptoSymbolsService', () => {
  let service: CryptoSymbolsService;
  let repo: ReturnType<typeof createMockRepo>;
  let http: ReturnType<typeof createMockHttpService>;
  let pagination: ReturnType<typeof createMockPaginationService>;

  beforeEach(async () => {
    repo = createMockRepo();
    http = createMockHttpService();
    pagination = createMockPaginationService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoSymbolsService,
        { provide: getRepositoryToken(CryptoSymbol), useValue: repo },
        { provide: HttpService, useValue: http },
        { provide: PaginationService, useValue: pagination },
      ],
    }).compile();

    service = module.get(CryptoSymbolsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getSymbols', () => {
    it('should return paginated symbols with metadata', async () => {
      const params: CryptoSymbolQueryParamsDto = { page: 1, limit: 2, order: 'ASC', query: '' };
      const queryBuilder: any = {
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockCryptoSymbols, 2]),
      };
      repo.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

      const result = await service.getSymbols(params);

      expect(queryBuilder.orderBy).toHaveBeenCalledWith('name', 'ASC');
      expect(result.data).toEqual(mockCryptoSymbols);
      expect(result.metaData.total).toBe(2);
    });

    it('should apply query filter if provided', async () => {
      const params: CryptoSymbolQueryParamsDto = { page: 1, limit: 2, order: 'DESC', query: 'btc' };
      const queryBuilder: any = {
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockCryptoSymbols, 1]),
      };
      repo.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

      await service.getSymbols(params);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(crypto-symbol.symbol) LIKE :query',
        { query: '%btc%' },
      );
    });
  });

  describe('populateCryptoSymbols', () => {
    it('should return early if table is already populated', async () => {
      repo.count.mockResolvedValue(251);
      const result = await service.populateCryptoSymbols();

      expect(result.message).toBe('Table already populated');
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should fetch and save symbols if table is not populated', async () => {
      repo.count.mockResolvedValue(0);
      http.axiosRef.get.mockResolvedValue({ data: mockExternalApiSymbols });

      repo.save.mockResolvedValue(mockCryptoSymbols);

      const result = await service.populateCryptoSymbols();

      expect(result.message).toBe('successfully populated');
      expect(result.data).toEqual(mockCryptoSymbols);
      expect(repo.save).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ symbol: 'btc' })]),
      );
    });
  });

  describe('getSymbolsFromExternalApi', () => {
    it('should return data from external API', async () => {
      http.axiosRef.get.mockResolvedValue({ data: mockExternalApiSymbols });
      const result = await service.getSymbolsFromExternalApi();
      expect(result).toEqual(mockExternalApiSymbols);
    });

    it('should throw BadRequestException on error', async () => {
      http.axiosRef.get.mockRejectedValue(new Error('fail'));

      await expect(service.getSymbolsFromExternalApi()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSpecificSymbol', () => {
    it('should return symbol by name', async () => {
      repo.findOne.mockResolvedValue(mockCryptoSymbols[0]);
      const result = await service.getSpecificSymbol('BTC');
      expect(result).toEqual(mockCryptoSymbols[0]);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { symbol: 'btc' },
      });
    });
  });
});
