import { Module } from '@nestjs/common';
import { StockSymbolsController } from './stock-symbols.controller';
import { StockSymbolsService } from './stock-symbols.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { StockSymbol } from './stock-symbol.entity';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockSymbol]),
    HttpModule.register({
      baseURL: 'https://financialmodelingprep.com/',
    }),
    CoreModule,
  ],
  controllers: [StockSymbolsController],
  providers: [StockSymbolsService],
  exports: [StockSymbolsService],
})
export class StockSymbolsModule {}
