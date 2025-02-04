import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../../env';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InfoTableService {
  constructor(private readonly httpService: HttpClient) {}

  getInfo() {
    return this.httpService
      .get(`${API_URL}/stocks`)
      .pipe(map((data) => [data]));
  }
}
