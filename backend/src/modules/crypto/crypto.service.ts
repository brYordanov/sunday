import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { Crypto } from './crypto.entity';
import {
  CryptoSchema,
  CryptoSymbolSchema,
  DetailedCryptoInfoDto,
  GetStockQueryParamsDto,
  RegisterCryptoBodyDto,
} from '@sunday/validations';
import { CryptoSymbolsService } from '../crypto-symbols/crypto-symbols.service';
import { CounterKeyEnum, RegisterCounterService } from '../core/register-counter.service';

@Injectable()
export class CryptoService {
  constructor(
    @InjectRepository(Crypto)
    private readonly cryptoRepository: Repository<Crypto>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly cryptoSymbolService: CryptoSymbolsService,
    private readonly counterService: RegisterCounterService,
  ) {}

  async registerCrypto(symbol: string): Promise<Crypto> {
    const existingRecord = await this.cryptoRepository.findOneBy(<FindOptionsWhere<Crypto>>{
      symbol: symbol,
    });
    if (existingRecord) {
      return existingRecord;
    }

    const cachedData = await this.cacheService.getCachedData(symbol);
    if (cachedData) {
      const cryptoRawData = JSON.parse(cachedData);
      return this.saveCrypto(cryptoRawData, symbol);
    }

    const dailyCryptoRawData = await this.getDataFromExternalApi(symbol);
    const monthlyCryptoRawData = this.convertToMonthly(dailyCryptoRawData['Data']);

    await this.cacheService.setCachedData(symbol, JSON.stringify(monthlyCryptoRawData));
    return this.saveCrypto(monthlyCryptoRawData, symbol);
  }

  async saveCrypto(data, symbol: string): Promise<Crypto> {
    const { oldestRecordDate, newestRecordDate } = this.getDateRange(data);
    const processedData = await this.cryptoRepository.create({
      oldestRecordDate,
      newestRecordDate,
      symbol,
    });

    return this.cryptoRepository.save(processedData);
  }

  async getDataFromExternalApi(symbol: string): Promise<any> {
    const dailyRequestCount = await this.counterService.getCounter(CounterKeyEnum.CRYPTO);
    if (dailyRequestCount >= 20) throw new BadRequestException('Daily request limit reached');
    await this.counterService.incrementCounter(CounterKeyEnum.CRYPTO);
    const response = await this.httpService.axiosRef.get(
      `https://data-api.coindesk.com/index/cc/v1/historical/days?market=cadli&instrument=${symbol.toUpperCase()}-USD&limit=5000&aggregate=1&fill=true&apply_mapping=true&response_format=JSON`,
    );
    return response.data;
  }

  async getCrypto(params: GetStockQueryParamsDto): Promise<Crypto[]> {
    const query = this.cryptoRepository.createQueryBuilder('crypto');

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      if (key === 'order') {
        query.orderBy('crypto.createdAt', value as 'ASC' | 'DESC');
      } else if (key === 'createdAfter') {
        const formattedDate = new Date(value).toISOString();
        query.andWhere(`crypto.createdAt > :${key}`, { [key]: formattedDate });
      } else if (key === 'createdBefore') {
        const formattedDate = new Date(value).toISOString();
        query.andWhere(`crypto.createdAt < :${key}`, { [key]: formattedDate });
      } else if (typeof value === 'string') {
        query.andWhere(`LOWER(crypto.${key}) LIKE :${key}`, { [key]: `%${value.toLowerCase()}%` });
      } else {
        query.andWhere(`crypto.${key} = :${key}`, { [key]: value });
      }
    });

    return query.getMany();
  }

  async getDetailedInfo(params: RegisterCryptoBodyDto): Promise<DetailedCryptoInfoDto> {
    const [analysedData, symbolData, cachedData] = await Promise.all([
      this.cryptoRepository.findOne({
        where: { symbol: params.symbol },
      }),
      this.cryptoSymbolService.getSpecificSymbol(params.symbol),
      this.cacheService.getCachedData(params.symbol),
    ]);

    return {
      analysedData: CryptoSchema.parse(analysedData),
      cryptoSymbolData: CryptoSymbolSchema.parse(symbolData),
      cachedData: JSON.parse(cachedData),
    };
  }

  private getDateRange(monthlyData) {
    const dates = Object.keys(monthlyData);

    if (dates.length === 0) {
      return { oldestRecordDate: null, newestRecordDate: null };
    }

    let oldestRecordDate = dates[0];
    let newestRecordDate = dates[0];

    for (let i = 1; i < dates.length; i++) {
      const date = dates[i];
      if (date < oldestRecordDate) {
        oldestRecordDate = date;
      }
      if (date > newestRecordDate) {
        newestRecordDate = date;
      }
    }

    return { oldestRecordDate, newestRecordDate };
  }

  private convertToMonthly(data) {
    const monthly = {};

    for (const day of data) {
      const date = new Date(day.TIMESTAMP * 1000);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-28`;

      if (!monthly[key]) {
        monthly[key] = {
          open: day.OPEN,
          close: day.CLOSE,
          high: day.HIGH,
          low: day.LOW,
          volume: day.VOLUME || 0,
          _timestamp: day.TIMESTAMP,
        };
      } else {
        if (day.TIMESTAMP > monthly[key]._timestamp) {
          monthly[key].close = day.CLOSE;
          monthly[key]._timestamp = day.TIMESTAMP;
        }

        if (day.TIMESTAMP < new Date(`${key}-01`).getTime() / 1000) {
          monthly[key].open = day.OPEN;
        }

        monthly[key].high = Math.max(monthly[key].high, day.HIGH);
        monthly[key].low = Math.min(monthly[key].low, day.LOW);
        monthly[key].volume += day.VOLUME || 0;
      }
    }

    return monthly;
  }
}
