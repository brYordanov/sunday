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

  chartType: 'candlestick' | 'line' | 'area' = 'candlestick';

  ngOnInit(): void {
    console.log(this.id);
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  onChartTypeChange(type: 'candlestick' | 'line' | 'area'): void {
    this.chartType = type;
    this.renderChart();
  }

  private renderChart(): void {
    if (!this.chartData) {
      console.error('Chart data is not provided');
      return;
    }

    const layout = {
      title: 'Stock Price Chart',
      xaxis: { type: 'date' },
      yaxis: { title: 'Price (USD)' },
    };

    let trace: any;

    if (this.chartType === 'candlestick') {
      trace = {
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
    } else if (this.chartType === 'line') {
      trace = {
        x: this.chartData.dates,
        y: this.chartData.close,
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        line: {
          color: '#3D9970',
          shape: 'linear',
        },
        name: 'Close Price',
      };
    } else if (this.chartType === 'area') {
      trace = {
        x: this.chartData.dates,
        y: this.chartData.close,
        type: 'scatter',
        mode: 'lines',
        fill: 'tozeroy',
        line: {
          color: '#3D9970',
          shape: 'linear',
        },
        name: 'Close Price',
      };
    }

    Plotly.react(`stock-chart-${this.id}`, [trace], layout);
  }
}
