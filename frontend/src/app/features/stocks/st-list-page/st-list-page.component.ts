import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StockService } from '../stocks.service';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { Column } from '../../../shared/components/info-table/info-table.types';
import { InfoTableComponent } from '../../../shared/components/info-table/info-table.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-stocks',
  imports: [
    SearchBarComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    InfoTableComponent,
    LoaderComponent,
  ],
  templateUrl: './st-list-page.component.html',
  styleUrl: './st-list-page.component.scss',
})
export class StocksListComponent {
  private stockService = inject(StockService);
  private searchInput$ = new BehaviorSubject<string>('');
  isLoading = false;
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
      name: 'createdAt',
      title: 'Monitored Since',
      type: 'Date',
    },
    {
      name: 'action',
      title: '',
      type: 'Link',
      linkPath: '/stocks',
    },
  ];

  options$ = this.searchInput$.pipe(
    debounceTime(300),
    map((value) => value.trim().toUpperCase()),
    distinctUntilChanged(),
    switchMap((value) => this.stockService.getStockSymbols(value)),
    map((response) => response.data.map((option) => option.symbol)),
  );

  stockRegisterForm = new FormGroup({
    symbol: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  stocksData = this.stockService.stocks$;

  onSubmit() {
    if (this.stockRegisterForm.valid) {
      const symbol = this.stockRegisterForm.value.symbol!;
      this.isLoading = true;
      this.stockService
        .registerStock({ symbol })
        .pipe(
          tap(() => {
            this.isLoading = false;
            this.stockService.refreshStocks();
            this.stockRegisterForm.reset();
            this.stockRegisterForm.reset({ symbol: '' });
            this.stockRegisterForm.markAsPristine();
            this.stockRegisterForm.markAsUntouched();
            this.stockRegisterForm.get('symbol')?.setErrors(null);
          }),
        )
        .subscribe();
    }
  }

  onInputSearchBar = (value: string) => {
    this.searchInput$.next(value);
  };
}
