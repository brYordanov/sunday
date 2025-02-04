import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  private readonly apiKey: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly stockService: StocksService,
  ) {
    this.apiKey = this.configService.get<string>('API_KEY') ?? '';
  }

  @Get()
  getStockData() {
    return this.stockService.getStockData();
  }
}
