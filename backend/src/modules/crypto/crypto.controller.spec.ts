import { Test, TestingModule } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { DetailedCryptoInfoDto, RegisterCryptoBodyDto } from '@sunday/validations';

describe('CryptoController', () => {
  let controller: CryptoController;

  const mockCryptoService = {
    getCrypto: jest.fn(),
    getDetailedInfo: jest.fn(),
    registerCrypto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoController],
      providers: [
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    controller = module.get<CryptoController>(CryptoController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return detailed info from getDetailedStockInfo()', async () => {
    const mockParams: RegisterCryptoBodyDto = { symbol: 'eth' };
    const mockResult: DetailedCryptoInfoDto = {
      analysedData: {} as any,
      cachedData: {} as any,
      cryptoSymbolData: {} as any,
    };

    mockCryptoService.getDetailedInfo.mockResolvedValue(mockResult);

    const result = await controller.getDetailedStockInfo(mockParams);
    expect(result).toEqual(mockResult);
    expect(mockCryptoService.getDetailedInfo).toHaveBeenCalledWith(mockParams);
  });
});
