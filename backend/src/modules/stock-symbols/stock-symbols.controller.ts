import { Controller, Get, Post, Query } from '@nestjs/common';
import { StockSymbolQueryParamsDto, StockSymbolQueryParamsSchema } from '@sunday/validations';

import { StockSymbolsService } from './stock-symbols.service';
import { ValidateQuery } from 'src/core/decorators/validation';

@Controller('stock-symbols')
export class StockSymbolsController {
  constructor(private readonly stockSymbolSrvice: StockSymbolsService) {}

  @Get()
  @ValidateQuery(StockSymbolQueryParamsSchema)
  async getSymbols(@Query() params: StockSymbolQueryParamsDto) {
    return this.stockSymbolSrvice.getSymbols(params);
  }

  @Post('populate')
  async registerAllStockSymbols() {
    return this.stockSymbolSrvice.populateTable();
  }
}
