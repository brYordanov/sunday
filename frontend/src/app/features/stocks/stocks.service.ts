import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, switchMap } from 'rxjs';
import { API_URL } from '../../../../env';
import { registerStockPayload, StockQueryParams } from './stocks.types';
import {
  DetailedStockInfoDto,
  GetStockQueryParamsDto,
  StockDto,
  StockSymbolPaginatedResponceDto,
} from '@sunday/validations';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  private refresh$ = new BehaviorSubject<string | undefined>(undefined);

  stocks$ = this.refresh$.pipe(
    switchMap((query) => this.http.get<StockDto[]>(`${API_URL}/stocks?${query}`)),
    shareReplay(),
  );

  registerStock(payload: registerStockPayload): Observable<StockDto> {
    return this.http.post<any>(`${API_URL}/stocks`, payload);
  }

  refreshStocks(formValue?: StockQueryParams) {
    const query = formValue ? this.buildQueryString(formValue) : '';
    this.refresh$.next(query);
  }

  getDetailedStockInfo(stockSymbol: string): Observable<DetailedStockInfoDto> {
    return this.http.get<DetailedStockInfoDto>(`${API_URL}/stocks/detailed?symbol=${stockSymbol}`);
  }

  getStockSymbols(query: string): Observable<StockSymbolPaginatedResponceDto> {
    return this.http.get<StockSymbolPaginatedResponceDto>(
      `${API_URL}/stock-symbols?query=${query}`,
    );
  }

  private buildQueryString(filters: StockQueryParams): string {
    const cleaned = Object.entries(filters)
      .filter(([_, value]) => value != null)
      .map(([key, value]) => {
        if (value instanceof Date) {
          return [key, value.toISOString().split('T')[0]];
        }
        return [key, value];
      });

    const query = new URLSearchParams(cleaned as [string, string][]).toString();
    return query ? `${query}` : '';
  }
}
