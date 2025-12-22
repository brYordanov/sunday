import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CacheService } from '../cache/cache.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  StockSymbolDto,
  GetStockQueryParamsDto,
  StockSymbolPropertyDto,
  DetailedStockInfoDto,
  StockSchema,
  StockSymbolSchema,
} from '@sunday/validations';
import { StockSymbolsService } from '../stock-symbols/stock-symbols.service';
import { CounterKeyEnum, RegisterCounterService } from '../core/register-counter.service';

@Injectable()
export class StocksService {
  private readonly apiKey: string;
  private readonly logger = new Logger(StocksService.name);
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly stockSymbolService: StockSymbolsService,
    private readonly configService: ConfigService,
    private readonly counterService: RegisterCounterService,
  ) {
    this.apiKey = this.configService.get<string>('ALPHA_VANTAGE_API_KEY');
  }

  async processStock(stockSymbol: string): Promise<Stock> {
    const existingRecord = await this.stockRepository.findOneBy({ symbol: stockSymbol });
    if (existingRecord) {
      return existingRecord;
    }

    const cachedData = await this.cacheService.getCachedData(stockSymbol);
    if (cachedData) {
      const stockRawData = JSON.parse(cachedData);
      return this.saveStock(stockRawData);
    }

    const stockRawData = await this.getDataFromExternalApi(stockSymbol);
    await this.counterService.incrementCounter(CounterKeyEnum.STOCK);
    await this.cacheService.setCachedData(stockSymbol, JSON.stringify(stockRawData));
    return this.saveStock(stockRawData);
  }

  async saveStock(data: Partial<Stock>): Promise<Stock> {
    const processedData = await this.stockRepository.create(this.createBody(data));
    return this.stockRepository.save(processedData);
  }

  async getDataFromExternalApi(symbol: string): Promise<any> {
    const currentDayUseCounter = await this.counterService.getCounter(CounterKeyEnum.STOCK);
    if (currentDayUseCounter >= 20) throw new BadRequestException('Daily request limit reached');
    const response = await this.httpService.axiosRef.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${this.apiKey}`,
    );
    const data = response.data;
    const hasTimeSeries = data && data['Monthly Time Series'];
    const hasError = data?.Note || data?.['Error Message'];
    if (!hasTimeSeries || hasError) {
      this.logger.error(`Alpha Vantage error for ${symbol}: ${hasError || 'missing data'}`);
      throw new BadRequestException('Failed to fetch stock data');
    }
    return data;
  }

  async getStock(params: GetStockQueryParamsDto): Promise<Stock[]> {
    const query = this.stockRepository.createQueryBuilder('stock');
    if (params.symbol) {
      params = { ...params, symbol: params.symbol.toUpperCase() };
    }

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

  async getDetailedInfo(params: StockSymbolPropertyDto): Promise<DetailedStockInfoDto> {
    const [analysedData, symbolData, cachedData] = await Promise.all([
      this.stockRepository.findOne({
        where: { symbol: params.symbol },
      }),
      this.stockSymbolService.getSpecificSymbol(params.symbol),
      this.cacheService.getCachedData(params.symbol),
    ]);

    return {
      analysedData: StockSchema.parse(analysedData),
      stockSymbolData: StockSymbolSchema.parse(symbolData),
      cachedData: JSON.parse(cachedData),
    };
  }

  createBody(stockData) {
    const dataPerMonth = stockData?.['Monthly Time Series'];
    if (!dataPerMonth) {
      this.logger.error('Missing Monthly Time Series data for stock');
      throw new BadRequestException('No stock data returned from provider');
    }
    const entries = Object.entries(dataPerMonth);
    if (!entries.length) {
      this.logger.error('Empty Monthly Time Series data for stock');
      throw new BadRequestException('No stock data returned from provider');
    }
    const [oldestRecordDate, oldestRecordValue] = entries[entries.length - 1];
    const [newestRecordDate, newestRecordValue] = entries[0];
    const symbol = stockData['Meta Data']['2. Symbol'];

    return { oldestRecordDate, newestRecordDate, symbol };
  }
}
