import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { dataPerMonth, Term, TermTypes } from './stock.types';
import { CacheService } from 'src/modules/cache/cache.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { createBody } from './stock.calculations';
import { map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StocksService {
  private readonly apiKey: string;
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('STOCK_DATA_API_KEY');
  }

  async processStock(stockSymbol) {
    const existingRecord = await this.findBySymbol(stockSymbol);
    if (existingRecord) {
      return existingRecord;
    }

    const cachedData = await this.cacheService.getCachedData(stockSymbol);
    if (cachedData) {
      const stockRawData = JSON.parse(cachedData);
      return this.saveStock(stockRawData);
    }

    const stockRawData = await this.getDataFromExternalApi(stockSymbol);
    await this.cacheService.setCachedData(stockSymbol, JSON.stringify(stockRawData));
    return this.saveStock(stockRawData);
  }

  findBySymbol(symbol: string) {
    return this.stockRepository.findOneBy({ symbol });
  }

  async saveStock(data: Partial<Stock>): Promise<Stock> {
    const processedData = await this.stockRepository.create(createBody(data));
    return this.stockRepository.save(processedData);
  }

  async getDataFromExternalApi(symbol: string): Promise<any> {
    const response = await this.httpService.axiosRef.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${this.apiKey}`,
    );
    return response.data;
  }
}
