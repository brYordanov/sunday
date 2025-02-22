import { Routes } from '@angular/router';
import { StocksComponent } from './features/stocks/stocks.component';

export const routes: Routes = [
  {
    path: '',
    component: StocksComponent,
    pathMatch: 'full',
  },
];
