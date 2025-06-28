import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';

import { StockSymbolsService } from './stock-symbols.service';
import { StockSymbol } from './stock-symbol.entity';
import { PaginationService } from '../core/pagination.service';
import { StockSymbolQueryParamsDto } from '@sunday/validations';

import {
  createMockRepo,
  createMockHttpService,
  createMockPaginationService,
  createConfigService,
} from '../../test-utils/stock-symbols/factories';

import {
  mockStockSymbols,
  mockExternalStockApiSymbols,
} from '../../test-utils/stock-symbols/mock-stock-symbols-data';
import { ConfigService } from '@nestjs/config';

describe('StockSymbolsService', () => {
  let service: StockSymbolsService;
  let repo: ReturnType<typeof createMockRepo>;
  let http: ReturnType<typeof createMockHttpService>;
  let pagination: ReturnType<typeof createMockPaginationService>;
  let config: ReturnType<typeof createConfigService>;

  beforeEach(async () => {
    repo = createMockRepo();
    http = createMockHttpService();
    pagination = createMockPaginationService();
    config = createConfigService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockSymbolsService,
        { provide: getRepositoryToken(StockSymbol), useValue: repo },
        { provide: ConfigService, useValue: config },
        { provide: HttpService, useValue: http },
        { provide: PaginationService, useValue: pagination },
      ],
    }).compile();

    service = module.get(StockSymbolsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getSymbols', () => {
    it('should return paginated symbols with metadata', async () => {
      const params: StockSymbolQueryParamsDto = { page: 1, limit: 2, order: 'ASC', query: '' };

      const queryBuilder: any = {
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockStockSymbols, 2]),
      };

      repo.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

      const result = await service.getSymbols(params);

      expect(queryBuilder.orderBy).toHaveBeenCalledWith('symbol', 'ASC');
      expect(result.data).toEqual(mockStockSymbols);
      expect(result.metaData.total).toBe(2);
    });

    it('should apply query filter if provided', async () => {
      const params: StockSymbolQueryParamsDto = { page: 1, limit: 2, order: 'DESC', query: 'aapl' };

      const queryBuilder: any = {
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockStockSymbols, 1]),
      };

      repo.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

      await service.getSymbols(params);

      expect(queryBuilder.andWhere).toHaveBeenCalledWith('stock-symbol.symbol LIKE :query', {
        query: '%AAPL%',
      });
    });
  });

  describe('populateTable', () => {
    it('should return early if table is already populated', async () => {
      repo.count.mockResolvedValue(1500);

      const result = await service.populateTable();

      expect(result.message).toBe('Table already populated');
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should fetch, map, save and return symbols if table is empty', async () => {
      repo.count.mockResolvedValue(0);
      http.axiosRef.get.mockResolvedValue({ data: mockExternalStockApiSymbols });

      const mappedEntities = mockExternalStockApiSymbols.map((item) => ({
        ...item,
        exchangeName: item.exchange,
      }));

      repo.create.mockImplementation((item) => item);
      repo.save.mockResolvedValue(mappedEntities);

      const result = await service.populateTable();

      expect(result.message).toBe('successfully populated');
      expect(result.data.length).toBeGreaterThan(0);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('getDataFromExternalApi', () => {
    it('should return data from external API', async () => {
      http.axiosRef.get.mockResolvedValue({ data: mockExternalStockApiSymbols });

      const result = await service.getDataFromExternalApi();

      expect(result).toEqual(mockExternalStockApiSymbols);
    });

    it('should throw BadRequestException on failure', async () => {
      http.axiosRef.get.mockRejectedValue(new Error('Request failed'));

      await expect(service.getDataFromExternalApi()).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSpecificSymbol', () => {
    it('should return symbol by name', async () => {
      repo.findOne.mockResolvedValue(mockStockSymbols[0]);

      const result = await service.getSpecificSymbol('AAPL');

      expect(result).toEqual(mockStockSymbols[0]);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { symbol: 'AAPL' },
      });
    });
  });
});
