import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { Crypto } from './crypto.entity';
import { GetStockQueryParamsDto } from '@sunday/validations';

@Injectable()
export class CryptoService {
  private readonly apiKey: string;
  constructor(
    @InjectRepository(Crypto)
    private readonly cryptoRepository: Repository<Crypto>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('COIN_DESK_API_KEY');
  }

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
    const response = await this.httpService.axiosRef.get(
      `https://data-api.coindesk.com/index/cc/v1/historical/days?market=cadli&instrument=${symbol}-USD&limit=5000&aggregate=1&fill=true&apply_mapping=true&response_format=JSON`,
    );
    return response.data;
  }

  async getCrypto(params: GetStockQueryParamsDto): Promise<Crypto[] | Crypto> {
    const query = this.cryptoRepository.createQueryBuilder('crypto');

    Object.entries(params).forEach(([key, value]) => {
      if (!value) return;

      if (key === 'order') {
        query.orderBy('crypto.createdAt', value as 'ASC' | 'DESC');
      } else if (key === 'createdAfter') {
        const formattedDate = new Date(value).toISOString();
        query.andWhere(`crypto.createdAt > :${key}`, { [key]: formattedDate });
      } else if (key === 'createdBefore') {
        const formattedDate = new Date(value).toISOString();
        query.andWhere(`crypto.createdAt < :${key}`, { [key]: formattedDate });
      } else {
        query.andWhere(`crypto.${key} = :${key}`, { [key]: value });
      }
    });

    return query.getMany();
  }

  private getDateRange(monthlyData) {
    if (!monthlyData || monthlyData.length === 0) {
      return { oldestRecordDate: null, newestRecordDate: null };
    }

    let oldest = monthlyData[0];
    let newest = monthlyData[0];

    for (const entry of monthlyData) {
      if (entry.timestamp < oldest.timestamp) {
        oldest = entry;
      }
      if (entry.timestamp > newest.timestamp) {
        newest = entry;
      }
    }

    const formatDate = (timestamp) => {
      const d = new Date(timestamp * 1000);
      return d.toISOString().split('T')[0];
    };

    return {
      oldestRecordDate: formatDate(oldest.timestamp),
      newestRecordDate: formatDate(newest.timestamp),
    };
  }

  private convertToMonthly(data) {
    const monthly = {};

    for (const day of data) {
      const date = new Date(day.TIMESTAMP * 1000);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthly[key] || day.TIMESTAMP > monthly[key].TIMESTAMP) {
        monthly[key] = {
          date: key,
          close: day.CLOSE,
          timestamp: day.TIMESTAMP,
        };
      }
    }

    return Object.values(monthly).sort((a, b) => a['timestamp'] - b['timestamp']);
  }
}
