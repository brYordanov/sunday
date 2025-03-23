import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { CacheModule } from 'src/modules/cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stock]),
    HttpModule.register({
      baseURL: 'https://www.alphavantage.co',
    }),
    ConfigModule.forRoot(),
    CacheModule,
  ],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
