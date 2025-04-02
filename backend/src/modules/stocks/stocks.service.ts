import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { CacheService } from 'src/modules/cache/cache.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { Repository } from 'typeorm';
import { createBody } from './stock.calculations';
import { ConfigService } from '@nestjs/config';
import { GetStockQueryParamsDto } from '@sunday/validations';

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
    this.apiKey = this.configService.get<string>('ALPHA_VANTAGE_API_KEY');
  }

  async processStock(stockSymbol: string): Promise<Stock> {
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

  async getStock(params: GetStockQueryParamsDto): Promise<Stock[]> {
    const query = this.stockRepository.createQueryBuilder('stock');

    Object.entries(params).forEach(([key, value]) => {
      if (!value) return;

      if (key === 'order') {
        query.orderBy('stock.createdAt', value as 'ASC' | 'DESC');
      } else if (key === 'createdAfter') {
        const formattedDate = new Date(value).toISOString();
        query.andWhere(`stock.createdAt > :${key}`, { [key]: formattedDate });
      } else if (key === 'createdBefore') {
        const formattedDate = new Date(value).toISOString();
        query.andWhere(`stock.createdAt < :${key}`, { [key]: formattedDate });
      } else {
        query.andWhere(`stock.${key} = :${key}`, { [key]: value });
      }
    });

    return query.getMany();
  }
}
