import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { CacheModule } from 'src/modules/cache/cache.module';
import { Stock } from './stock.entity';
import { SchedulerService } from 'src/services/scheduler.service';
import { StockSymbolsModule } from '../stock-symbols/stock-symbols.module';

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
  ],
  controllers: [StocksController],
  providers: [StocksService, SchedulerService],
})
export class StocksModule {}
