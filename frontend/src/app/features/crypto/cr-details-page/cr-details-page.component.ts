import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from '../crypto.service';
import { map, shareReplay, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { prepareChartData } from './helpers';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ChartComponent } from '../../../shared/components/chart/chart.component';

@Component({
  selector: 'app-cr-details-page',
  imports: [CommonModule, LoaderComponent, MatTabsModule, ChartComponent],
  templateUrl: './cr-details-page.component.html',
  styleUrl: './cr-details-page.component.scss',
})
export class CrDetailsPageComponent {
  private route = inject(ActivatedRoute);
  private cryptoService = inject(CryptoService);

  cryptoSymbol$ = this.route.paramMap.pipe(map((params) => params.get('symbol')));

  cryptoData$ = this.cryptoSymbol$.pipe(
    switchMap((symbol) => {
      if (!symbol) return [];
      return this.cryptoService.getDetailedCryptoInfo(symbol);
    }),
    shareReplay(1),
  );

  oneYearData$ = this.cryptoData$.pipe(map((data) => prepareChartData(data.cachedData, 1)));

  fiveYearData$ = this.cryptoData$.pipe(map((data) => prepareChartData(data.cachedData, 5)));

  tenYearData$ = this.cryptoData$.pipe(map((data) => prepareChartData(data.cachedData, 10)));

  fromBeginningData$ = this.cryptoData$.pipe(map((data) => prepareChartData(data.cachedData)));
}
