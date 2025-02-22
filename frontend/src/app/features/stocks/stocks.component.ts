import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StockService } from './stocks.service';
import { CommonModule } from '@angular/common';
import { shareReplay } from 'rxjs';
import { Column } from '../../shared/components/info-table/info-table.types';
import { InfoTableComponent } from '../../shared/components/info-table/info-table.component';

@Component({
  selector: 'app-stocks',
  imports: [
    SearchBarComponent,
    ContainerComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    InfoTableComponent,
  ],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
})
export class StocksComponent {
  private stockService = inject(StockService);
  tableColumns: Column[] = [
    {
      name: 'symbol',
      title: 'Symbol',
    },
    {
      name: 'oldestRecordDate',
      title: 'Oldest Record Date',
      type: 'Date',
    },
    {
      name: 'newestRecordDate',
      title: 'Newest Record Date',
      type: 'Date',
    },
    {
      name: 'createdAt',
      title: 'Monitored Since',
      type: 'Date',
    },
  ];

  stockRegisterForm = new FormGroup({
    stockSymbol: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  stocksData = this.stockService.getStocks().pipe(shareReplay());

  onSubmit() {
    if (this.stockRegisterForm.valid) {
      const stockSymbol = this.stockRegisterForm.value.stockSymbol!;
      console.log({ stockSymbol });

      this.stockService.registerStock({ stockSymbol }).subscribe();
    }
  }
}
