import { Controller, Post } from '@nestjs/common';
import { StockSymbolsService } from './stock-symbols.service';

@Controller('stock-symbols')
export class StockSymbolsController {
  constructor(private readonly stockSymbolSrvice: StockSymbolsService) {}

  @Post()
  async registerAllStockSymbols() {
    return this.stockSymbolSrvice.registerAllStockSymbols(data);
  }
}

var data = [  
  {
    symbol: 'NOVC',
    name: 'Novation Companies, Inc.',
    price: 0.01,
    exchange: 'Other OTC',
    exchangeShortName: 'PNK',
    type: 'stock',
  },
  {
    symbol: 'L0CK.F',
    name: 'iShares Digital Security UCITS ETF',
    price: 6.221,
    exchange: 'Frankfurt Stock Exchange',
    exchangeShortName: 'XETRA',
    type: 'etf',
  },
];
