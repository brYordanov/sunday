import { Component, inject } from '@angular/core';
import { StockService } from '../stocks.service';
import { CommonModule } from '@angular/common';
import { Column } from '../../../shared/components/info-table/info-table.types';
import { InfoTableComponent } from '../../../shared/components/info-table/info-table.component';
import { RegisterStockFormComponent } from '../register-stock-form/register-stock-form.component';
import { FilterStockFormComponent } from '../filter-stock-form/filter-stock-form.component';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-stocks',
  imports: [
    CommonModule,
    InfoTableComponent,
    RegisterStockFormComponent,
    FilterStockFormComponent,
    TooltipComponent,
    MatIcon,
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

  stocksData = this.stockService.stocks$;
}
