import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, switchMap } from 'rxjs';
import { API_URL } from '../../../../env';
import { registerStockPayload } from './stocks.types';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  private refresh$ = new BehaviorSubject<void>(undefined);

  stocks$ = this.refresh$.pipe(
    switchMap(() => this.http.get<any>(`${API_URL}/stocks`)),
    shareReplay()
  );

  registerStock(payload: registerStockPayload): Observable<any> {
    return this.http.post<any>(`${API_URL}/stocks`, payload);
  }

  refreshStocks() {
    this.refresh$.next();
  }
}
