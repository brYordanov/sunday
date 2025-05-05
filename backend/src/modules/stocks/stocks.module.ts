import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { CacheModule } from 'src/modules/cache/cache.module';
import { Stock } from './stock.entity';
import { StockSymbolsModule } from '../stock-symbols/stock-symbols.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Stock]),
    HttpModule.register({
      baseURL: 'https://www.alphavantage.co',
    }),
    ConfigModule.forRoot(),
    CacheModule,
    StockSymbolsModule,
    CoreModule,
  ],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
