import { AfterViewInit, Component, Input } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import Plotly from 'plotly.js-dist';
import { ChartData } from './chart.types';

@Component({
  selector: 'app-chart',
  imports: [MatButtonToggleModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements AfterViewInit {
  @Input() chartData: ChartData | null = null;
  @Input() id: string = '';

  ngAfterViewInit(): void {
    console.log(this.chartData);

    if (!this.chartData) {
      console.error('Chart data is not provided');
      return;
    }
    const trace = {
      x: this.chartData.dates,
      open: this.chartData.open,
      high: this.chartData.high,
      low: this.chartData.low,
      close: this.chartData.close,
      type: 'candlestick',
      name: 'Price',
      increasing: { line: { color: '#3D9970' }, fillcolor: '#3D9970' },
      decreasing: { line: { color: '#FF4136' }, fillcolor: '#FF4136' },
    };
    const layout = {
      title: 'Stock Price Chart',
      xaxis: { type: 'date' },
      yaxis: { title: 'Price (USD)' },
    };
    Plotly.newPlot(`stock-chart-${this.id}`, [trace], layout);
  }
}
