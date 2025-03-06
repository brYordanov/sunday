import { Controller, Post } from '@nestjs/common';
import { StockSymbolsService } from './stock-symbols.service';

@Controller('stock-symbols')
export class StockSymbolsController {
  constructor(private readonly stockSymbolSrvice: StockSymbolsService) {}

  @Post('populate')
  async registerAllStockSymbols() {
    return this.stockSymbolSrvice.populateTable();
  }
}
