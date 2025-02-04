import { Routes } from '@angular/router';
import { InfoTableComponent } from './features/info-table/info-table.component';

export const routes: Routes = [
    {
        path: '',
        component: InfoTableComponent,
        pathMatch: 'full'
    }
];
