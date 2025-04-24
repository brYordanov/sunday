import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoSymbol } from './crypto-symbols.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ExternalApiCryptoSymbolDto } from './crypto-symbol.types';
import {
  CryptoSymbolPaginatedResponceDto,
  CryptoSymbolQueryParamsDto,
  PopulateCryptoSymbolsResponseDto,
} from '@sunday/validations';
import { PaginationService } from 'src/core/services/pagination.service';

@Injectable()
export class CryptoSymbolsService {
  constructor(
    @InjectRepository(CryptoSymbol)
    private readonly cryptoSymbolRepository: Repository<CryptoSymbol>,
    private readonly httpService: HttpService,
    private readonly paginationService: PaginationService,
  ) {}

  async getSymbols(params: CryptoSymbolQueryParamsDto): Promise<CryptoSymbolPaginatedResponceDto> {
    const queryBuilder = this.cryptoSymbolRepository
      .createQueryBuilder('crypto-symbol')
      .orderBy('name', params.order);

    if (params.query) {
      queryBuilder.andWhere('crypto-symbol.name LIKE :query', {
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

  async populateCryptoSymbols(): Promise<PopulateCryptoSymbolsResponseDto> {
    if (await this.isTablePopulated()) {
      return {
        message: 'Table already populated',
      };
    }
    const symbols = await this.getSymbolsFromExternalApi();
    const transformedSymbols = symbols.map((symbol) =>
      this.transformToExternalApiCryptoSymbolDto(symbol),
    );

    const savedEntities = await this.cryptoSymbolRepository.save(transformedSymbols);
    return {
      message: 'successfully populated',
      data: savedEntities,
    };
  }

  async getSymbolsFromExternalApi(): Promise<ExternalApiCryptoSymbolDto[]> {
    try {
      const response = await this.httpService.axiosRef.get<ExternalApiCryptoSymbolDto[]>(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1',
      );
      return response.data;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  private transformToExternalApiCryptoSymbolDto(data: ExternalApiCryptoSymbolDto): CryptoSymbol {
    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image,
      circulating_supply: data.circulating_supply,
      total_supply: data.total_supply,
      max_supply: data.max_supply,
      ath: data.ath,
      ath_change_percentage: data.ath_change_percentage,
      ath_date: data.ath_date,
      atl: data.atl,
      atl_change_percentage: data.atl_change_percentage,
      last_updated: data.last_updated,
    };
  }

  async isTablePopulated(): Promise<boolean> {
    const count = await this.cryptoSymbolRepository.count();
    return count > 250;
  }
}
