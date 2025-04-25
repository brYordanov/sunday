import { Component, inject, viewChild } from '@angular/core';
import { Column } from '../../../shared/components/info-table/info-table.types';
import { CryptoService } from '../crypto.service';
import { CommonModule } from '@angular/common';
import { InfoTableComponent } from '../../../shared/components/info-table/info-table.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RegisterCryptoFormComponent } from '../register-crypto-form/register-crypto-form.component';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip.component';
import { FilterCryptoFormComponent } from '../filter-crypto-form/filter-crypto-form.component';

@Component({
  selector: 'app-cr-list-page',
  imports: [
    CommonModule,
    InfoTableComponent,
    MatExpansionModule,
    MatIcon,
    RegisterCryptoFormComponent,
    TooltipComponent,
    FilterCryptoFormComponent,
  ],
  templateUrl: './cr-list-page.component.html',
  styleUrl: './cr-list-page.component.scss',
})
export class CrListPageComponent {
  private cryptoService = inject(CryptoService);
  accordion = viewChild.required(MatAccordion);

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

  cryptoData$ = this.cryptoService.cryptos$;
}
