import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { Stock } from './stock.entity';
import {
  GetStockQueryParamsDto,
  GetStockQueryParamsSchema,
  StockSchema,
  StockSymbolPropertySchema,
  StockSymbolPropertyDto,
} from '@sunday/validations';
import { ValidateBody, ValidateQuery, ValidateResponse } from 'src/core/decorators/validation';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stockService: StocksService) {}

  @Get()
  @ValidateQuery(GetStockQueryParamsSchema)
  @ValidateResponse(StockSchema)
  async getStock(@Query() params: GetStockQueryParamsDto): Promise<Stock[] | Stock> {
    return this.stockService.getStock(params);
  }

  // @ValidateResponse()
  @Get('detailed')
  @ValidateQuery(StockSymbolPropertySchema)
  async getDetailedStockInfo(@Query() params: StockSymbolPropertyDto) {
    return this.stockService.getDetailedInfo(params);
  }

  @Post()
  @ValidateBody(StockSymbolPropertySchema)
  @ValidateResponse(StockSchema)
  async registerStock(@Body() body: StockSymbolPropertyDto): Promise<Stock> {
    return this.stockService.processStock(body.symbol);
  }
}
