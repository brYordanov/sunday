import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { Stock } from './stock.entity';
import {
  GetStockQueryParamsDto,
  GetStockQueryParamsSchema,
  RegisterStockBodyDto,
  RegisterStockBodySchema,
  StockSchema,
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

  @Post()
  @ValidateBody(RegisterStockBodySchema)
  @ValidateResponse(StockSchema)
  async registerStock(@Body() body: RegisterStockBodyDto): Promise<Stock> {
    return this.stockService.processStock(body.symbol);
  }
}
