import { Test, TestingModule } from '@nestjs/testing';
import { CryptoSymbolsController } from './crypto-symbols.controller';
import { CryptoSymbolsService } from './crypto-symbols.service';

import { CryptoSymbolQueryParamsDto, CryptoSymbolPaginatedResponceDto } from '@sunday/validations';
import { mockCryptoSymbols } from '../../test-utils/crypto-symbol/mock-crypto-symbols-data';

describe('CryptoSymbolsController', () => {
  let controller: CryptoSymbolsController;
  let service: jest.Mocked<CryptoSymbolsService>;

  const mockPaginatedResult: CryptoSymbolPaginatedResponceDto = {
    data: mockCryptoSymbols,
    metaData: {
      total: 1,
      page: 1,
      itemsPerPage: 10,
      totalPages: 1,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoSymbolsController],
      providers: [
        {
          provide: CryptoSymbolsService,
          useValue: {
            getSymbols: jest.fn().mockResolvedValue(mockPaginatedResult),
            populateCryptoSymbols: jest.fn().mockResolvedValue({ message: 'Populated' }),
          },
        },
      ],
    }).compile();

    controller = module.get(CryptoSymbolsController);
    service = module.get(CryptoSymbolsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /crypto-symbols', () => {
    it('should call service.getSymbols and return paginated crypto symbols', async () => {
      const query: CryptoSymbolQueryParamsDto = {
        page: 1,
        limit: 10,
        order: 'ASC',
        query: '',
      };

      const result = await controller.getSymbols(query);

      expect(service.getSymbols).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('POST /crypto-symbols/populate', () => {
    it('should call populateCryptoSymbols and return message', async () => {
      const result = await controller.populateCryptoSymbols();

      expect(service.populateCryptoSymbols).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Populated' });
    });
  });
});
