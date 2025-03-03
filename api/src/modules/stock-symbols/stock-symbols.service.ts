import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockSymbol } from './entities/stock-symbol.entity';

@Injectable()
export class StockSymbolsService {
    private readonly apiKey: string
    constructor(
        @InjectRepository(StockSymbol)
        private readonly stockSymbolRepository: Repository<StockSymbol>,
        private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('FINANCIAL_MODALING_PREP_API_KEY')
    }


    registerAllStockSymbols(symbols: any[]): StockSymbol[] {
        const symbolEntities = symbols.map((item) => {
            return this.stockSymbolRepository.create({
              symbol: item.symbol,
              name: item.name,
              exchangeName: item.exchange,
              exchangeShortName: item.exchangeShortName,
              type: item.type,
            });
          });

          return symbolEntities
    }
}