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

    const styles = getComputedStyle(document.documentElement);
    const bgColor = styles.getPropertyValue('--color-background')?.trim();
    const textColor = styles.getPropertyValue('--color-text')?.trim();
    const lineColor = styles.getPropertyValue('--color-accent-primary')?.trim();
    const upColor = styles.getPropertyValue('--color-success')?.trim();
    const downColor = styles.getPropertyValue('--color-error')?.trim();
    const fontFamily = styles.getPropertyValue('--font-primary')?.trim();

    const layout: Partial<Plotly.Layout> = {
      title: {
        text: 'Stock Price Chart',
        font: {
          family: fontFamily,
          color: textColor,
        },
      },
      paper_bgcolor: bgColor,
      plot_bgcolor: bgColor,
      font: {
        family: fontFamily,
        color: textColor,
      },
      xaxis: {
        type: 'date',
        color: textColor,
        gridcolor: 'rgba(255,255,255,0.05)', // optional: subtle gridlines
      },
      yaxis: {
        title: {
          text: 'Price (USD)',
          font: { color: textColor },
        },
        tickfont: { color: textColor },
        gridcolor: 'rgba(255,255,255,0.05)',
      },
      margin: { t: 40, l: 50, r: 10, b: 40 },
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
        increasing: { line: { color: upColor } },
        decreasing: { line: { color: downColor } },
      };
    } else {
      trace = {
        x: this.chartData.dates,
        y: this.chartData.close,
        type: 'scatter',
        mode: 'lines',
        fill: this.chartType === 'area' ? 'tozeroy' : 'none',
        line: {
          color: lineColor,
          shape: 'linear',
        },
        name: 'Close Price',
      };
    }

    Plotly.react(`stock-chart-${this.id}`, [trace], layout);
  }

  getCurrentThemeStyles(): CSSStyleDeclaration {
    const themeElement = document.body;
    return getComputedStyle(themeElement);
  }
}
