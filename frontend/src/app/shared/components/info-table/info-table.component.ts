import { Component, inject } from '@angular/core';
import { InfoTableService } from './info-table.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-info-table',
  imports: [CommonModule, MatTableModule],
  templateUrl: './info-table.component.html',
  styleUrl: './info-table.component.scss',
})
export class InfoTableComponent {
  infoTableService = inject(InfoTableService);
  displayedColumns: string[] = [
    'symbol',
    'newestRecordDate',
    'oldestRecordDate',
    'termAnalysis',
    'termPredictability',
  ];
  info = this.infoTableService.getInfo();
}
