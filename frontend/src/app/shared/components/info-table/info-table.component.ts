import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Column } from './info-table.types';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-info-table',
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterModule, LoaderComponent],
  templateUrl: './info-table.component.html',
  styleUrl: './info-table.component.scss',
})
export class InfoTableComponent {
  @Input() data$!: Observable<any[]>;
  @Input() columns: Column[] = [];
  get displayedColumns(): string[] {
    return this.columns.map((col) => col.name);
  }
}
