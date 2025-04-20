import { Component, inject } from '@angular/core';
import { StockService } from '../stocks.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../../shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-register-stock-form',
  imports: [
    SearchBarComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: './register-stock-form.component.html',
  styleUrl: './register-stock-form.component.scss',
})
export class RegisterStockFormComponent {
  private stockService = inject(StockService);
  snackBar = inject(MatSnackBar);
  private registerBarInput$ = new BehaviorSubject<string>('');
  isLoading = false;

  stockRegisterForm = new FormGroup({
    symbol: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  onSubmit() {
    if (this.stockRegisterForm.valid) {
      const symbol = this.stockRegisterForm.value.symbol!;
      this.isLoading = true;
      this.stockService
        .registerStock({ symbol })
        .pipe(
          tap({
            next: () => {
              this.isLoading = false;
              this.stockService.refreshStocks();
              this.stockRegisterForm.reset({ symbol: '' });
              this.stockRegisterForm.markAsPristine();
              this.stockRegisterForm.markAsUntouched();
              this.stockRegisterForm.get('symbol')?.setErrors(null);
              this.showSuccessMessage();
            },
            error: () => {
              this.isLoading = false;
              this.showErrorMessage();
            },
          }),
          shareReplay(1),
        )
        .subscribe();
    }
  }

  options$ = this.registerBarInput$.pipe(
    debounceTime(300),
    map((value) => value.trim().toUpperCase()),
    distinctUntilChanged(),
    switchMap((value) => this.stockService.getStockSymbols(value)),
    map((response) => response.data.map((option) => option.symbol)),
  );

  onInputRegisterBar = (value: string) => {
    this.registerBarInput$.next(value);
  };

  showSuccessMessage() {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message: 'Registered stock successfully!', icon: 'check' },
      duration: 1000,
      panelClass: ['success-snackbar'],
    });
  }

  showErrorMessage() {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message: 'Something went wrong!', icon: 'priority_high' },
      duration: 1000,
      panelClass: ['error-snackbar'],
    });
  }
}
