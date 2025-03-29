import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ContainerComponent } from '../../../shared/components/container/container.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StockService } from '../stocks.service';
import { CommonModule } from '@angular/common';
import { shareReplay, tap } from 'rxjs';
import { Column } from '../../../shared/components/info-table/info-table.types';
import { InfoTableComponent } from '../../../shared/components/info-table/info-table.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

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
    LoaderComponent,
  ],
  templateUrl: './st-list-page.component.html',
  styleUrl: './st-list-page.component.scss',
})
export class StocksListComponent {
  private stockService = inject(StockService);
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

  stockRegisterForm = new FormGroup({
    stockSymbol: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
      updateOn: 'submit',
    }),
  });

  stocksData = this.stockService.stocks$;

  onSubmit() {
    if (this.stockRegisterForm.valid) {
      const stockSymbol = this.stockRegisterForm.value.stockSymbol!;
      this.isLoading = true;
      this.stockService
        .registerStock({ stockSymbol })
        .pipe(
          tap(() => {
            this.isLoading = false;
            this.stockService.refreshStocks();
            this.stockRegisterForm.reset();
            this.stockRegisterForm.reset({ stockSymbol: '' });
            this.stockRegisterForm.markAsPristine();
            this.stockRegisterForm.markAsUntouched();
            this.stockRegisterForm.controls.stockSymbol.updateValueAndValidity();
          }),
        )
        .subscribe();
    }
  }
}
