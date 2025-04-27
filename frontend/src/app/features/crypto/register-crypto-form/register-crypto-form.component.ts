import { Component, inject } from '@angular/core';
import { CryptoService } from '../crypto.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarComponent } from '../../../shared/components/snackbar/snackbar.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-register-crypto-form',
  imports: [
    SearchBarComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: './register-crypto-form.component.html',
  styleUrl: './register-crypto-form.component.scss',
})
export class RegisterCryptoFormComponent {
  private cryptoService = inject(CryptoService);
  snackBar = inject(MatSnackBar);
  private registerBarInput$ = new BehaviorSubject<string>('');
  isLoading = false;

  cryptoRegisterForm = new FormGroup({
    symbol: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  onSubmit() {
    if (this.cryptoRegisterForm.valid) {
      const symbol = this.cryptoRegisterForm.value.symbol!;
      this.isLoading = true;
      this.cryptoService
        .registerCrypto({ symbol })
        .pipe(
          tap({
            next: () => {
              this.isLoading = false;
              this.cryptoService.refreshStocks();
              this.cryptoRegisterForm.reset({ symbol: '' });
              this.cryptoRegisterForm.markAsPristine();
              this.cryptoRegisterForm.markAsUntouched();
              this.cryptoRegisterForm.get('symbol')?.setErrors(null);
              this.registerBarInput$.next('');
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
    map((value) => value.trim()),
    distinctUntilChanged(),
    switchMap((value) => this.cryptoService.getStockSymbols(value)),
    map((response) => response.data.map((option) => option.symbol.toUpperCase())),
  );

  onInputRegisterBar = (value: string) => {
    this.registerBarInput$.next(value);
  };

  showSuccessMessage() {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message: 'Registered crypto successfully!', icon: 'check' },
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
