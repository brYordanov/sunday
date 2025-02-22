import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  private readonly apiKey: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly stockService: StocksService,
  ) {
    this.apiKey = this.configService.get<string>('STOCK_DATA_API_KEY') ?? '';
  }

  @Post()
  registerStock(@Body('stockSymbol') stockSymbol: string) {
    return this.stockService.processStock(stockSymbol);
  }
}
