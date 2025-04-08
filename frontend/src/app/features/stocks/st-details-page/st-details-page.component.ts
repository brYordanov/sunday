import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { map, shareReplay, switchMap, of } from 'rxjs';
import { StockService } from '../stocks.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { prepareChartData } from './helpers';
import { ChartComponent } from '../../../shared/components/chart/chart.component';
import { Column } from '../../../shared/components/info-table/info-table.types';

@Component({
  selector: 'app-st-details-page',
  imports: [CommonModule, LoaderComponent, MatTabsModule, ChartComponent],
  templateUrl: './st-details-page.component.html',
  styleUrl: './st-details-page.component.scss',
})
export class StDetailsPageComponent {
  private route = inject(ActivatedRoute);
  private stockService = inject(StockService);
  tableColumns: Column[] = [
    {
      name: 'criteria',
      title: '',
    },
    {
      name: 'shortTerm',
      title: 'shortTerm',
    },
    {
      name: 'midTerm',
      title: 'midTerm',
    },
    {
      name: 'longTerm',
      title: 'longTerm',
    },
  ];

  stockSymbol$ = this.route.paramMap.pipe(map((params) => params.get('symbol')));

  stockData$ = this.stockSymbol$.pipe(
    switchMap((symbol) => {
      if (!symbol) return [];
      return this.stockService.getDetailedStockInfo(symbol);
    }),
    shareReplay(1),
  );

  oneYearData$ = this.stockData$.pipe(
    map((data) => prepareChartData(data.cachedData['Monthly Time Series'], 1)),
  );

  fiveYearData$ = this.stockData$.pipe(
    map((data) => prepareChartData(data.cachedData['Monthly Time Series'], 5)),
  );

  tenYearData$ = this.stockData$.pipe(
    map((data) => prepareChartData(data.cachedData['Monthly Time Series'], 10)),
  );

  fromBeginningData$ = this.stockData$.pipe(
    map((data) => prepareChartData(data.cachedData['Monthly Time Series'])),
  );
}
