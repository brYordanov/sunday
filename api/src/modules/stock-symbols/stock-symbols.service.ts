import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockSymbol } from './stock-symbol.entity';
import {
  StockSymbolExternalApiDto,
  StockSymbolQueryParamsDto,
  StockSymbolResponceDto,
} from '@sunday/validations';

@Injectable()
export class StockSymbolsService {
  private readonly apiKey: string;
  constructor(
    @InjectRepository(StockSymbol)
    private readonly stockSymbolRepository: Repository<StockSymbol>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('FINANCIAL_MODALING_PREP_API_KEY');
  }

  async getSymbols(params: StockSymbolQueryParamsDto): Promise<any> {
    return params;
  }

  async populateTable(): Promise<StockSymbolResponceDto> {
    if (await this.isTablePopulated()) {
      return {
        statusCode: 200,
        message: 'Table already populated',
      };
    }

    const symbols = await this.getDataFromExternalApi();

    const symbolEntities = symbols.map((item) => {
      return this.stockSymbolRepository.create({
        symbol: item.symbol,
        name: item.name,
        exchangeName: item.exchange,
        exchangeShortName: item.exchangeShortName,
        type: item.type,
      });
    });

    const batchSize = 500;
    const savedEntities: StockSymbol[] = [];

    for (let i = 0; i < symbolEntities.length; i += batchSize) {
      const batch = symbolEntities.slice(i, i + batchSize);
      const savedBatch = await this.stockSymbolRepository.save(batch);
      savedEntities.push(...savedBatch);
    }

    return {
      statusCode: 200,
      message: 'successfully populated',
      data: savedEntities,
    };
  }
  async getDataFromExternalApi(): Promise<StockSymbolExternalApiDto[]> {
    try {
      const response = await this.httpService.axiosRef.get<StockSymbolExternalApiDto[]>(
        `https://financialmodelingprep.com/api/v3/stock/list?apikey=${this.apiKey}`,
      );
      return response.data;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async isTablePopulated(): Promise<boolean> {
    const count = await this.stockSymbolRepository.count();
    return count > 1000;
  }
}
