import { Controller, Get, Post, Query } from '@nestjs/common';
import { StockSymbolsService } from './stock-symbols.service';
import { ValidateQuery } from 'src/core/decorators/validation';

import { StockSymbolQueryParamsDto } from '@libs/validations/stock-symbols.dtos';

@Controller('stock-symbols')
export class StockSymbolsController {
  constructor(private readonly stockSymbolSrvice: StockSymbolsService) {}

  @Get()
  @ValidateQuery(StockSymbolQueryParamsDto)
  async getSymbols(params) {
    return this.stockSymbolSrvice.getSymbols(params)
  }

  @Post('populate')
  async registerAllStockSymbols() {
    return this.stockSymbolSrvice.populateTable();
  }
}
