import { Routes } from '@angular/router';
import { StocksListComponent } from './features/stocks/st-list-page/st-list-page.component';

export const routes: Routes = [
  {
    path: '',
    component: StocksListComponent,
    pathMatch: 'full',
  },
  {
    path: 'stocks',
    component: StocksListComponent,
    pathMatch: 'full',
  },
  {
    path: 'stocks/:symbol',
    loadComponent: () =>
      import('./features/stocks/st-details-page/st-details-page.component').then(
        (m) => m.StDetailsPageComponent,
      ),
  },
  {
    path: 'crypto',
    loadComponent: () =>
      import('./features/crypto/cr-list-page/cr-list-page.component').then(
        (m) => m.CrListPageComponent,
      ),
  },
  {
    path: 'crypto/:symbol',
    loadComponent: () =>
      import('./features/crypto/cr-details-page/cr-details-page.component').then(
        (m) => m.CrDetailsPageComponent,
      ),
  },
];
