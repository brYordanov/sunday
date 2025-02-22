import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../../env';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  registerStock(payload: registerStockPayload): Observable<any> {
    return this.http.post<any>(`${API_URL}/stocks`, payload);
  }
}

type registerStockPayload = {
  stockSymbol: string;
};
