import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StockService } from './stocks.service';

@Component({
  selector: 'app-stocks',
  imports: [
    SearchBarComponent,
    ContainerComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
})
export class StocksComponent {
  private stockService = inject(StockService);

  stockRegisterForm = new FormGroup({
    stockSymbol: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  onSubmit() {
    if (this.stockRegisterForm.valid) {
      const stockSymbol = this.stockRegisterForm.value.stockSymbol!;
      console.log({ stockSymbol });

      this.stockService.registerStock({ stockSymbol }).subscribe();
    }
  }
}
