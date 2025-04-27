import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CryptoService } from '../crypto.service';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-filter-crypto-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './filter-crypto-form.component.html',
  styleUrl: './filter-crypto-form.component.scss',
})
export class FilterCryptoFormComponent {
  cryptoSrvice = inject(CryptoService);

  cryptoFilterForm = new FormGroup({
    symbol: new FormControl(''),
    createdAfter: new FormControl<Date | null>(null),
    createdBefore: new FormControl<Date | null>(null),
  });

  onSubmit() {
    this.cryptoSrvice.refreshStocks(this.cryptoFilterForm.value);
  }

  onClear() {
    this.cryptoFilterForm.reset();
  }
}
