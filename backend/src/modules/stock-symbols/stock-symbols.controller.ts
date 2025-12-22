import { Controller, Get, Post, Query } from '@nestjs/common';
import {
  StockSymbolPaginatedResponceDto,
  StockSymbolPaginatedResponceSchema,
  StockSymbolQueryParamsDto,
  StockSymbolQueryParamsSchema,
} from '@sunday/validations';

import { StockSymbolsService } from './stock-symbols.service';
import { ValidateQuery, ValidateResponse } from '../../core/decorators/validation';

@Controller('stock-symbols')
export class StockSymbolsController {
  constructor(private readonly stockSymbolSrvice: StockSymbolsService) {}

  @Get()
  @ValidateQuery(StockSymbolQueryParamsSchema)
  @ValidateResponse(StockSymbolPaginatedResponceSchema)
  async getSymbols(
    @Query() params: StockSymbolQueryParamsDto,
  ): Promise<StockSymbolPaginatedResponceDto> {
    return this.stockSymbolSrvice.getSymbols(params);
  }

  @Post('populate')
  async registerAllStockSymbols() {
    return 'this EP was depricated';
    return this.stockSymbolSrvice.populateTable();
  }
}
