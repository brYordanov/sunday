import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

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

  async registerCrypto(cryptoSymbol: string): Promise<any> {
    const existingRecord = await this.cryptoRepository.findOneBy(<FindOptionsWhere<Crypto>>{
      symbol: cryptoSymbol,
    });
    if (existingRecord) {
      return existingRecord;
    }

    const cachedData = await this.cacheService.getCachedData(cryptoSymbol);
    if (cachedData) {
      const cryptoRawData = JSON.parse(cachedData);
      return this.saveCrypto(cryptoRawData);
    }

    const stockRawData = await this.getDataFromExternalApi(cryptoSymbol);
    await this.cacheService.setCachedData(cryptoSymbol, JSON.stringify(stockRawData));
    return 123;
    return this.saveCrypto(stockRawData);
  }

  async saveCrypto(data: Partial<Crypto>): Promise<any> {
    //   const processedData = await this.cryptoRepository.create(this.createBody(data));
    //   return this.cryptoRepository.save(processedData);
  }

  createBody(stockData) {
    const dataPerMonth = stockData['Monthly Time Series'];
    const entries = Object.entries(dataPerMonth);
    const [oldestRecordDate, oldestRecordValue] = entries[entries.length - 1];
    const [newestRecordDate, newestRecordValue] = entries[0];
    const symbol = stockData['Meta Data']['2. Symbol'];

    return { oldestRecordDate, newestRecordDate, symbol };
  }

  async getDataFromExternalApi(symbol: string): Promise<any> {
    const response = await this.httpService.axiosRef.get(
      `https://data-api.coindesk.com/index/cc/v1/historical/days?market=cadli&instrument=ETH-USD&limit=30&aggregate=1&fill=true&apply_mapping=true&response_format=JSON`,
    );
    return response.data;
  }
}
