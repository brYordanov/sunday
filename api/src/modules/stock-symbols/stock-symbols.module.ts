import { Module } from '@nestjs/common';
import { StockSymbolsController } from './stock-symbols.controller';
import { StockSymbolsService } from './stock-symbols.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Symbol } from './entities/stock-symbol.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Symbol]),
    HttpModule.register({
      baseURL: 'https://financialmodelingprep.com/'
    })
  ],
  controllers: [StockSymbolsController],
  providers: [StockSymbolsService]
})
export class StockSymbolsModule {}
