import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StockService } from '../stocks.service';

@Component({
  selector: 'app-filter-stock-form',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './filter-stock-form.component.html',
  styleUrl: './filter-stock-form.component.scss',
})
export class FilterStockFormComponent {
  stockSrvice = inject(StockService);

  stockFilterForm = new FormGroup({
    symbol: new FormControl(''),
    createdAfter: new FormControl<Date | null>(null),
    createdBefore: new FormControl<Date | null>(null),
  });

  onSubmit() {
    this.stockSrvice.refreshStocks(this.stockFilterForm.value);
  }

  onClear() {
    this.stockFilterForm.reset();
  }
}
