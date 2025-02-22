import { Module } from '@nestjs/common';
import { StockSymbolsController } from './stock-symbols.controller';
import { StockSymbolsService } from './stock-symbols.service';

@Module({
  controllers: [StockSymbolsController],
  providers: [StockSymbolsService]
})
export class StockSymbolsModule {}
