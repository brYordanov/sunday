import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { Stock } from './stock.entity';

@Controller('stocks')
export class StocksController {
  private readonly apiKey: string;
  constructor(private readonly stockService: StocksService) {}

  @Get()
  async getStock(
    @Query('id') id?: number,
    @Query('symbol') symbol?: string,
    @Query('createdAfter') createdAfter?: string,
    @Query('createdBefore') createdBefore?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ): Promise<Stock[]> {
    return this.stockService.getStock({ id, symbol, createdAfter, createdBefore, order });
  }

  @Post()
  async registerStock(@Body('stockSymbol') stockSymbol: string) {
    return this.stockService.processStock(stockSymbol);
  }
}
