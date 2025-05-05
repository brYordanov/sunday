import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Crypto } from './crypto.entity';
import { CryptoService } from './crypto.service';
import { ValidateBody, ValidateQuery, ValidateResponse } from '../../core/decorators/validation';
import {
  GetCryptoQueryParamsSchema,
  CryptoSchema,
  RegisterCryptoBodyDto,
  RegisterCryptoBodySchema,
  GetCryptoQueryParamsDto,
  DetailedCryptoInfoDto,
} from '@sunday/validations';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get()
  @ValidateQuery(GetCryptoQueryParamsSchema)
  @ValidateResponse(CryptoSchema)
  async getStock(@Query() params: GetCryptoQueryParamsDto): Promise<Crypto[]> {
    return this.cryptoService.getCrypto(params);
  }

  @Get('detailed')
  // @ValidateResponse(DetailedStockInfoSchema)
  // @ValidateQuery(StockSymbolPropertySchema)
  async getDetailedStockInfo(
    @Query() params: RegisterCryptoBodyDto,
  ): Promise<DetailedCryptoInfoDto> {
    return this.cryptoService.getDetailedInfo(params);
  }

  @Post()
  @ValidateBody(RegisterCryptoBodySchema)
  @ValidateResponse(CryptoSchema)
  async RegisterCrypto(@Body() body: RegisterCryptoBodyDto): Promise<Crypto> {
    return this.cryptoService.registerCrypto(body.symbol);
  }
}
