import { Test, TestingModule } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

import {
  GetCryptoQueryParamsDto,
  DetailedCryptoInfoDto,
  RegisterCryptoBodyDto,
  CryptoSchema,
} from '@sunday/validations';

import { mockAnalysedData } from '../../test-utils/crypto/mock-crypto-data';
import { mockCryptoSymbolData } from '../../test-utils/crypto-symbol/mock-crypto-symbols-data';

describe('CryptoController', () => {
  let controller: CryptoController;
  let service: jest.Mocked<CryptoService>;

  const mockCryptoList = [mockAnalysedData];

  const mockDetailedInfo: DetailedCryptoInfoDto = {
    analysedData: CryptoSchema.parse(mockAnalysedData),
    cryptoSymbolData: mockCryptoSymbolData,
    cachedData: {
      '2024-01-01': { OPEN: 10, CLOSE: 15, HIGH: 20, LOW: 5, VOLUME: 1000 },
    },
  };

  const mockCrypto = mockCryptoList[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoController],
      providers: [
        {
          provide: CryptoService,
          useValue: {
            getCrypto: jest.fn().mockResolvedValue(mockCryptoList),
            getDetailedInfo: jest.fn().mockResolvedValue(mockDetailedInfo),
            registerCrypto: jest.fn().mockResolvedValue(mockCrypto),
          },
        },
      ],
    }).compile();

    controller = module.get(CryptoController);
    service = module.get(CryptoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /crypto', () => {
    it('should return list of cryptos from service', async () => {
      const query: GetCryptoQueryParamsDto = {
        symbol: 'btc',
        order: 'ASC',
      };

      const result = await controller.getStock(query);

      expect(service.getCrypto).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockCryptoList);
    });
  });

  describe('GET /crypto/detailed', () => {
    it('should return detailed crypto info', async () => {
      const query: RegisterCryptoBodyDto = { symbol: 'BTC' };

      const result = await controller.getDetailedStockInfo(query);

      expect(service.getDetailedInfo).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockDetailedInfo);
    });
  });

  describe('POST /crypto', () => {
    it('should call service.registerCrypto and return created crypto', async () => {
      const body: RegisterCryptoBodyDto = { symbol: 'BTC' };

      const result = await controller.RegisterCrypto(body);

      expect(service.registerCrypto).toHaveBeenCalledWith('BTC');
      expect(result).toEqual(mockCrypto);
    });
  });
});
