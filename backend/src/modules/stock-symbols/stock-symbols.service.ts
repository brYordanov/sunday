import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockSymbol } from './stock-symbol.entity';
import {
  StockSymbolExternalApiDto,
  StockSymbolPaginatedResponceDto,
  StockSymbolQueryParamsDto,
  StockSymbolResponceDto,
} from '@sunday/validations';
import { PaginationService } from 'src/core/services/pagination.service';

@Injectable()
export class StockSymbolsService {
  private readonly apiKey: string;
  constructor(
    @InjectRepository(StockSymbol)
    private readonly stockSymbolRepository: Repository<StockSymbol>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly paginationService: PaginationService,
  ) {
    this.apiKey = this.configService.get<string>('FINANCIAL_MODALING_PREP_API_KEY');
  }

  async getSymbols(params: StockSymbolQueryParamsDto): Promise<StockSymbolPaginatedResponceDto> {
    const queryBuilder = this.stockSymbolRepository
      .createQueryBuilder('stock-symbol')
      .orderBy('symbol', params.order);

    if (params.query) {
      queryBuilder.andWhere('stock-symbol.symbol LIKE :query', {
        query: `%${params.query}%`,
      });
    }

    this.paginationService.paginate(queryBuilder, params.page, params.limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      metaData: {
        total,
        page: params.page,
        itemsPerPage: params.limit > total ? total : params.limit,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async populateTable(): Promise<StockSymbolResponceDto> {
    if (await this.isTablePopulated()) {
      return {
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

  async getSpecificSymbol(symbolName: string): Promise<StockSymbol> {
    return this.stockSymbolRepository.findOne({
      where: {
        symbol: symbolName,
      },
    });
  }
}
