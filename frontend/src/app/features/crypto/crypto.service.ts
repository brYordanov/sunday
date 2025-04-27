import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CryptoDto,
  CryptoSymbolPaginatedResponceDto,
  DetailedCryptoInfoDto,
} from '@sunday/validations';
import { BehaviorSubject, Observable, shareReplay, switchMap } from 'rxjs';
import { API_URL } from '../../../../env';
import { CryptoQueryParams, registerCryptoPayload } from './crypto.types';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  constructor(private readonly http: HttpClient) {}

  private refresh$ = new BehaviorSubject<string | undefined>(undefined);

  cryptos$ = this.refresh$.pipe(
    switchMap((query) => this.http.get<CryptoDto[]>(`${API_URL}/crypto?${query}`)),
    shareReplay(),
  );

  refreshStocks(formValue?: CryptoQueryParams) {
    const query = formValue ? this.buildQueryString(formValue) : '';
    this.refresh$.next(query);
  }

  registerCrypto(payload: registerCryptoPayload): Observable<CryptoDto> {
    return this.http.post<any>(`${API_URL}/crypto`, payload);
  }

  getStockSymbols(query: string): Observable<CryptoSymbolPaginatedResponceDto> {
    return this.http.get<CryptoSymbolPaginatedResponceDto>(
      `${API_URL}/crypto-symbols?query=${query}`,
    );
  }

  getDetailedCryptoInfo(cryptoSymbol: string): Observable<DetailedCryptoInfoDto> {
    return this.http.get<DetailedCryptoInfoDto>(
      `${API_URL}/crypto/detailed?symbol=${cryptoSymbol}`,
    );
  }

  private buildQueryString(filters: CryptoQueryParams): string {
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
