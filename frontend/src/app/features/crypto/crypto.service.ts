import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CryptoDto,
  CryptoSymbolPaginatedResponceDto,
  DetailedCryptoInfoDto,
} from '@sunday/validations';
import { BehaviorSubject, Observable, shareReplay, switchMap } from 'rxjs';
import { ENV } from '../../../../environments/environment';
import { CryptoQueryParams, registerCryptoPayload } from './crypto.types';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  constructor(private readonly http: HttpClient) {}

  private refresh$ = new BehaviorSubject<string | undefined>(undefined);

  cryptos$ = this.refresh$.pipe(
    switchMap((query) => this.http.get<CryptoDto[]>(`${ENV.apiUrl}/crypto?${query}`)),
    shareReplay(),
  );

  refreshStocks(formValue?: CryptoQueryParams) {
    const query = formValue ? this.buildQueryString(formValue) : '';
    this.refresh$.next(query);
  }

  registerCrypto(payload: registerCryptoPayload): Observable<CryptoDto> {
    return this.http.post<any>(`${ENV.apiUrl}/crypto`, payload);
  }

  getStockSymbols(query: string): Observable<CryptoSymbolPaginatedResponceDto> {
    return this.http.get<CryptoSymbolPaginatedResponceDto>(
      `${ENV.apiUrl}/crypto-symbols?query=${query}`,
    );
  }

  getDetailedCryptoInfo(cryptoSymbol: string): Observable<DetailedCryptoInfoDto> {
    return this.http.get<DetailedCryptoInfoDto>(
      `${ENV.apiUrl}/crypto/detailed?symbol=${cryptoSymbol}`,
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
