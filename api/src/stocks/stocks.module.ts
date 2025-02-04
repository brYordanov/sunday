import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://www.alphavantage.co',
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
