import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-st-details-page',
  imports: [],
  templateUrl: './st-details-page.component.html',
  styleUrl: './st-details-page.component.scss',
})
export class StDetailsPageComponent {
  private route = inject(ActivatedRoute);
  stockSymbol = this.route.snapshot.paramMap.get('symbol');
}
