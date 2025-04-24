import { Controller, Get, Post, Query } from '@nestjs/common';
import { CryptoSymbolsService } from './crypto-symbols.service';
import { ValidateQuery, ValidateResponse } from 'src/core/decorators/validation';
import {
  CryptoSymbolPaginatedResponceSchema,
  CryptoSymbolQueryParamsDto,
  CryptoSymbolQueryParamsSchema,
  populateCryptoSymbolsResponseSchema,
} from '@sunday/validations';

@Controller('crypto-symbols')
export class CryptoSymbolsController {
  constructor(private readonly cryptoSymbolService: CryptoSymbolsService) {}

  @Get()
  @ValidateQuery(CryptoSymbolQueryParamsSchema)
  @ValidateResponse(CryptoSymbolPaginatedResponceSchema)
  async getSymbols(@Query() params: CryptoSymbolQueryParamsDto): Promise<any> {
    return this.cryptoSymbolService.getSymbols(params);
  }

  @ValidateResponse(populateCryptoSymbolsResponseSchema)
  @Post('populate')
  async populateCryptoSymbols() {
    return this.cryptoSymbolService.populateCryptoSymbols();
  }
}
