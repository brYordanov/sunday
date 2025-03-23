import { Module } from '@nestjs/common';
import { StockSymbolsController } from './stock-symbols.controller';
import { StockSymbolsService } from './stock-symbols.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { StockSymbol } from './stock-symbol.entity';
import { PaginationService } from '../../core/services/pagination.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockSymbol]),
    HttpModule.register({
      baseURL: 'https://financialmodelingprep.com/',
    }),
  ],
  controllers: [StockSymbolsController],
  providers: [StockSymbolsService, PaginationService],
})
export class StockSymbolsModule {}
